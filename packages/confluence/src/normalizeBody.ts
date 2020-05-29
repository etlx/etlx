import { Observable, OperatorFunction, pipe } from 'rxjs'
import { map } from 'rxjs/operators'
import { choose, split } from '@etlx/operators/core'
import { minify, stringifyBody, forEachAttribute, inlineImages } from '@etlx/operators/html'
import { log } from '@etlx/operators/@internal/log'
import { formatUrl } from '@etlx/operators/http'
import { ConfluencePageBody, ConfluenceConfig } from './types'
import { getPageBody, updateBody } from './utils'

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

const cleanHtml = (config: ConfluenceConfig, opts: NormalizeBodyOptions) => ($: Observable<string>) => $.pipe(
  cleanAttributes(config.confluence.host),
  choose(opts.inlineImages, inlineImages(config.confluence)),
  minify(),
)


export type NormalizeBodyOptions = {
  inlineImages?: boolean,
}

export function normalizeBody<T extends Page>(
  config: ConfluenceConfig,
  opts?: NormalizeBodyOptions,
): OperatorFunction<T, T> {
  return pipe(
    log<T>(config, 'Normalizing page body', 'confluence'),
    split(
      map(getPageBody),
      cleanHtml(config, opts || {}),
      stringifyBody(),
    ),
    map(([page, body]) => updateBody(page)(body)),
    log<T>(config, 'Page body normalized', 'confluence'),
  )
}
