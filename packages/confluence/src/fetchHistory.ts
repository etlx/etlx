import { pipe, OperatorFunction, of } from 'rxjs'
import { mergeMap, filter, distinct } from 'rxjs/operators'
import { expandWhile } from '@etlx/operators/core'
import { log } from '@etlx/operators/@internal/log'
import { ConfluenceConfig, ConfluencePageVersion, ConfluencePageExpandable } from './types'
import { getPageById } from './getPageById'

type Page = {
  id: string,
  version?: ConfluencePageVersion,
  history?: {
    lastUpdated?: ConfluencePageVersion,
    previousVersion?: ConfluencePageVersion,
    nextVersion?: ConfluencePageVersion,
  }
}

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

const checkPeriod = (page: Page, opts: FetchHistoryOptions) => {
  let { backward, from, to } = opts

  let prev = apply(page.history?.previousVersion?.when, parseDate)
  let curr = apply(page.version?.when, parseDate)
  let next = apply(page.history?.nextVersion?.when, parseDate)

  let stop = backward
    ? lt(prev, from) || lt(curr, from) || lt(next, from)
    : gt(prev, to) || gt(curr, to) || gt(next, to)

  return !stop
}

const checkVersion = (page: Page, opts: FetchHistoryOptions) => {
  let version = page.version!.number
  let lastVersion = page.history!.lastUpdated!.number

  return opts.backward ? version - 1 > 1 : version + 1 < lastVersion
}

const hasNextVersion = (opts: FetchHistoryOptions) => (page: Page) =>
  (!opts || checkPeriod(page, opts)) && checkVersion(page, opts)

const expand: any[] = ['version', 'history.lastUpdated', 'history.previousVersion', 'history.nextVersion']
const loadNextVersion = (config: ConfluenceConfig, { backward }: FetchHistoryOptions) => (page: Page) => {
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

const toChanges = (backward: boolean) => (page: Page) => {
  let prev = page.history!.previousVersion
  let curr = page.version!
  let next = page.history!.nextVersion

  return backward ? of(next, curr, prev) : of(prev, curr, next)
}

const loadVersionInfo = (config: ConfluenceConfig) => (page: Page) => {
  let expanded = page.version && page.history && page.history.lastUpdated
  let pageId = page.id
  let version = page.version?.number

  return expanded ? of(page) : getPageById(pageId, config, { expand, version }).pipe(
    log(config, 'Additional expand fields required. Reloading page...', 'confluence'),
  )
}

export type FetchHistoryOptions = Period & { backward?: boolean }

export const REQUIRED_EXPAND_FIELDS: ConfluencePageExpandable[] = expand.slice()

export function fetchHistory<T extends Page>(
  config: ConfluenceConfig,
  options?: FetchHistoryOptions,
): OperatorFunction<T, ConfluencePageVersion> {
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
