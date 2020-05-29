import { of, Observable } from 'rxjs'
import { mergeMap } from 'rxjs/operators'
import { expandWhile } from '@etlx/operators/core'
import { isNullOrUndefined } from '@etlx/operators/@internal/utils'
import { log, Logger } from '@etlx/operators/@internal/log'
import { fromJsonRequest, FromRequestOptions, authBasic } from '@etlx/operators/http'

import { ConfluencePage, ConfluenceConfig, ConfluencePageExpandable, ConfluencePaginatedResponse } from './types'

const DEFAULT_LIMIT = 20

type Response = ConfluencePaginatedResponse<ConfluencePage>

const logRequest = (logger: Logger, request: any) =>
  logger.info(`Loading ${request.url.query.limit} pages from '${request.url.query.spaceKey}' space`)

const getSpacePage = (config: ConfluenceConfig, { expand, limit, ...opts }: FetchContentOptions) => (start: number) => {
  let request: FromRequestOptions = {
    url: {
      host: config.confluence.host,
      path: '/rest/api/content',
      query: {
        start,
        expand: isNullOrUndefined(expand) ? undefined : expand.join(','),
        limit: limit || DEFAULT_LIMIT,
        type: 'page',
        status: 'current',
        ...opts,
      },
    },
    headers: authBasic(config.confluence),
    logger: config.logger,
  }

  return of(request).pipe(
    log(config, logRequest, 'confluence'),
    mergeMap(x => fromJsonRequest<Response>(x)),
  )
}


export type FetchContentOptions = {
  spaceKey?: string,
  type?: string,
  title?: string,
  limit?: number,
  status?: string,
  postingDay?: string,
  trigger?: string,
  orderby?: string,
  expand?: Array<ConfluencePageExpandable>,
}

export function fetchContent(
  config: ConfluenceConfig,
  options?: FetchContentOptions,
): Observable<ConfluencePage> {
  let opts = options || {}
  let page = getSpacePage(config, opts)

  let moreItem = (x: ConfluencePaginatedResponse<any>) => x.size > 0

  return page(0).pipe(
    expandWhile(moreItem, x => page(x.start + (opts.limit || DEFAULT_LIMIT))),
    mergeMap(({ results }) => results),
  )
}
