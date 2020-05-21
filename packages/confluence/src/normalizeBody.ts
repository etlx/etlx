import { Observable, of, OperatorFunction } from 'rxjs'
import { mergeMap, map } from 'rxjs/operators'
import { choose } from '@etlx/operators/core'
import { minify, stringifyBody, forEachAttribute, inlineImages } from '@etlx/operators/html'
import { LoggerConfig, log } from '@etlx/operators/@internal/log'
import { formatUrl } from '@etlx/operators/http'
import { ConfluencePageBody } from './types'
import { getPageBody, updateBody } from './utils'

export type NormalizeBodyOptions = LoggerConfig & {
  confluence: { host: string },
  inlineImages?: boolean,
}

type Page = { body?: ConfluencePageBody }

const cleanAttributes = (host: string) => ($: Observable<string>) => $.pipe(
  forEachAttribute((attr, parent) => {
    switch (attr.name) {
      case 'src':
      case 'href':
        // eslint-disable-next-line no-param-reassign
        attr.value = formatUrl(attr.value, { host, preserveAbsoluteUrls: true })
        return
      default:
        parent.removeAttribute(attr.name)
    }
  }),
)

const cleanHtml = (opts: NormalizeBodyOptions) => ($: Observable<string>) => $.pipe(
  cleanAttributes(opts.confluence.host),
  choose(opts.inlineImages, inlineImages(opts.confluence)),
  minify(),
)

export function normalizeBody<T extends Page>(opts: NormalizeBodyOptions): OperatorFunction<T, T> {
  return $ => $.pipe(
    log(opts, 'Normalizing page body', 'confluence'),
    mergeMap(page => of(getPageBody(page)).pipe(
      cleanHtml(opts),
      stringifyBody(),
      map(updateBody(page)),
    )),
    log(opts, 'Page body normalized', 'confluence'),
  )
}
