import { pipe, OperatorFunction, of } from 'rxjs'
import { mergeMap, filter, distinct, tap } from 'rxjs/operators'
import { expandWhile } from '@etlx/operators/core'
import { log } from '@etlx/operators/@internal/log'
import { ConfluenceConfig, ConfluencePageVersion, ConfluencePageExpandable, ConfluencePage } from './types'
import { getPageById } from './getPageById'

type Period = { from?: Date, to?: Date }

const notUndefined = <T>(x: T | undefined): x is T => x !== undefined
const apply = <A, B>(x: A | undefined, fn: (x: A) => B): B | undefined => x ? fn(x) : undefined
const parseDate = (x: string) => new Date(Date.parse(x))
const gt = (a: Date | undefined, b: Date | undefined) => a && b ? a > b : false
const lt = (a: Date | undefined, b: Date | undefined) => a && b ? a < b : false

const withinPeriod = ({ from, to }: Period) => ({ when }: ConfluencePageVersion) => {
  let date = parseDate(when)
  let start = !from || date >= from
  let end = !to || date <= to

  return start && end
}

const checkPeriod = (page: ConfluencePage, opts: FetchHistoryOptions) => {
  let { backward, from, to } = opts

  let prev = apply(page.history?.previousVersion?.when, parseDate)
  let curr = apply(page.version?.when, parseDate)
  let next = apply(page.history?.nextVersion?.when, parseDate)

  let stop = backward
    ? lt(prev, from) || lt(curr, from) || lt(next, from)
    : gt(prev, to) || gt(curr, to) || gt(next, to)

  return !stop
}

const checkVersion = (page: ConfluencePage, opts: FetchHistoryOptions) => {
  let version = page.version!.number
  let lastVersion = page.history!.lastUpdated!.number

  return opts.backward ? version - 1 > 1 : version + 1 < lastVersion
}

const hasNextVersion = (opts: FetchHistoryOptions) => (page: ConfluencePage) =>
  (!opts || checkPeriod(page, opts)) && checkVersion(page, opts)

const expand: any[] = ['version', 'history.lastUpdated', 'history.previousVersion', 'history.nextVersion']
const loadNextVersion = (config: ConfluenceConfig, { backward }: FetchHistoryOptions) => (page: ConfluencePage) => {
  let pageId = page.id

  let lastVersion = page.history!.lastUpdated!.number
  let currentVersion = page.version!.number

  let batch = backward ? -3 : 3
  let limit = backward ? 1 : lastVersion

  let nextVersion = currentVersion + batch
  let edge = (backward && nextVersion < limit) || (!backward && nextVersion > limit)
  let version = edge ? limit : nextVersion

  return getPageById(pageId, config, { expand, version })
}

const toChanges = (backward: boolean) => (page: ConfluencePage) => {
  let prev = page.history!.previousVersion
  let curr = page.version!
  let next = page.history!.nextVersion

  return backward ? of(next, curr, prev) : of(prev, curr, next)
}

const loadVersionInfo = (config: ConfluenceConfig) => (page: ConfluencePage) => {
  let expanded = page.version && page.history && page.history.lastUpdated
  let pageId = page.id
  let version = page.version?.number

  return expanded ? of(page) : getPageById(pageId, config, { expand, version }).pipe(
    log(config, 'Additional expand fields required. Reloading page...', 'confluence'),
  )
}

export type FetchHistoryOptions = Period & { backward?: boolean }

export const REQUIRED_EXPAND_FIELDS: ConfluencePageExpandable[] = expand.slice()

export const fetchHistory = (
  config: ConfluenceConfig,
  options?: FetchHistoryOptions,
): OperatorFunction<ConfluencePage, ConfluencePageVersion> => {
  let opts = options || {}
  let backward = opts.backward || false

  return pipe(
    mergeMap(loadVersionInfo(config)),
    expandWhile(
      hasNextVersion(opts),
      loadNextVersion(config, opts),
    ),
    mergeMap(toChanges(backward)),
    filter(notUndefined),
    filter(withinPeriod(opts)),
    distinct(x => x.number),
  )
}
