import { Observable, of } from 'rxjs'
import { mergeMap, map } from 'rxjs/operators'
import { expandWhile, log } from '@etlx/operators'
import { Logger } from '@etlx/operators/utils'
import { FromRequestOptions, fromJsonRequest, authBasic } from '@etlx/operators/http'

import { ConfluenceConfig, ConfluenceAttachment, ConfluencePaginatedResponse } from './types'
import { concatPages } from './utils'

export type GetPageAttachmentsOptions = ConfluenceConfig & {
    limit?: number,
    mediaType?: string,
    filename?: string,
}

type Page = { id: string }
type Attachments = {
    descendants: {
        attachment: ConfluencePaginatedResponse<ConfluenceAttachment>,
    },
}

type Response = ConfluencePaginatedResponse<ConfluenceAttachment>

const logRequest = (logger: Logger, request: any) =>
    logger.info(`Loading ${request.url.query.limit} attachments from '${request.url.query.pageId}' page`)

const loadAttachmentsBatch = (opts: GetPageAttachmentsOptions, pageId: string) => (start: number) => {
    let request: FromRequestOptions = {
        url: {
            host: opts.confluence.host,
            path: `/rest/api/content/${pageId}/child/attachment`,
            query: {
                start,
                limit: opts.limit || 20,
                mediaType: opts.mediaType,
                filename: opts.filename,
            },
        },
        headers: authBasic(opts.confluence),
        logger: opts.logger,
    }

    return of(request).pipe(
        log(opts.logger, logRequest, 'confluence'),
        mergeMap(x => fromJsonRequest<Response>(x)),
    )
}

const paginateAttachments = <T extends Page>(opts: GetPageAttachmentsOptions) => (page: T) => {
    let loadPage = loadAttachmentsBatch(opts, page.id)

    return loadPage(0).pipe(
        expandWhile(x => loadPage(x.start + (opts.limit || 20)), x => x.size > 0),
        concatPages<ConfluenceAttachment>(),
        map(attachment => ({
            ...page,
            descendants: {
                ...(page as any).descendants,
                attachment,
            },
        })),
    )
}

export const getPageAttachments = <T extends Page>(opts: GetPageAttachmentsOptions) =>
    ($: Observable<T>): Observable<T & Attachments> => $.pipe(
        mergeMap(paginateAttachments(opts)),
    )