import { of, OperatorFunction } from 'rxjs'
import { mergeMap, map } from 'rxjs/operators'
import { log, LoggerConfig } from '@etlx/operators/@internal/log'
import { getTextContent } from '@etlx/operators/html/getTextContent'

import { ConfluencePageBody } from './types'
import { getPageBody } from './utils'

type Page = { body?: ConfluencePageBody }

export type ExcerptBodyOptions = {
  maxLength?: number,
}

export function excerptBody<T extends Page>(
  config?: LoggerConfig,
  options?: ExcerptBodyOptions,
): OperatorFunction<T, T & { excerpt: string }> {
  let cfg = config || {}

  return $ => $.pipe(
    log(cfg, 'Making page body excerpt', 'confluence'),
    mergeMap(page => of(getPageBody(page)).pipe(
      getTextContent(options),
      map(excerpt => ({ ...page, excerpt })),
    )),
    log(cfg, 'Page body excerpt added', 'confluence'),
  )
}
