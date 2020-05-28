import { of, Observable } from 'rxjs'
import { mergeMap } from 'rxjs/operators'
import { FromRequestOptions, authBasic, fromJsonRequest } from '@etlx/operators/http'
import { isNullOrUndefined } from '@etlx/operators/@internal/utils'
import { log } from '@etlx/operators/@internal/log'
import { ConfluenceConfig, ConfluencePage, ConfluencePageExpandable } from './types'

export type GetPageByIdOptions = {
  expand?: ConfluencePageExpandable[],
  version?: number,
  status?: string,
}

export const getPageById = (pageId: string, config: ConfluenceConfig, opts?: GetPageByIdOptions) => {
  let { expand, version, status } = opts || {}

  let request: FromRequestOptions = {
    url: {
      host: config.confluence.host,
      path: `/rest/api/content/${pageId}`,
      query: {
        version,
        status,
        expand: isNullOrUndefined(expand) ? undefined : expand.join(','),
      },
    },
    headers: authBasic(config.confluence),
    logger: config.logger,
  }

  return of(request).pipe(
    log(config, `Loading page ${pageId} (${version || 'latest'})`, 'confluence'),
    mergeMap<FromRequestOptions, Observable<ConfluencePage>>(fromJsonRequest),
  )
}
