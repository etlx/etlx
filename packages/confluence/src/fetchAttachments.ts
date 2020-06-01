import { Observable, of } from 'rxjs'
import { mergeMap } from 'rxjs/operators'
import { expandWhile } from '@etlx/operators/core'
import { log, Logger } from '@etlx/operators/@internal/log'
import { FromRequestOptions, fromJsonRequest, authBasic } from '@etlx/operators/http'

import { ConfluenceConfig, ConfluenceAttachment, ConfluencePaginatedResponse } from './types'
import { concatPages } from './utils'

type Response = ConfluencePaginatedResponse<ConfluenceAttachment>

const logRequest = (logger: Logger, request: any) =>
  logger.info(`Loading ${request.url.query.limit} attachments from '${request.url.query.pageId}' page`)

const loadAttachmentsBatch = (pageId: string, config: ConfluenceConfig, opts?: FetchAttachmentsOptions) => (start: number) => {
  let request: FromRequestOptions = {
    url: {
      host: config.confluence.host,
      path: `/rest/api/content/${pageId}/child/attachment`,
      query: {
        start,
        limit: opts?.limit || 20,
        mediaType: opts?.mediaType,
        filename: opts?.filename,
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

export type FetchAttachmentsOptions = {
  limit?: number,
  mediaType?: string,
  filename?: string,
}

export function fetchAttachments(
  config: ConfluenceConfig,
  pageId: string,
  opts?: FetchAttachmentsOptions,
): Observable<ConfluenceAttachment> {
  let loadPage = loadAttachmentsBatch(pageId, config, opts)

  return loadPage(0).pipe(
    expandWhile(x => x.size > 0, x => loadPage(x.start + (opts?.limit || 20))),
    concatPages<ConfluenceAttachment>(),
    mergeMap(({ results }) => results),
  )
}
