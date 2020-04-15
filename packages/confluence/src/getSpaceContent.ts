import { of, Observable } from 'rxjs'
import { mergeMap, map } from 'rxjs/operators'
import { expandWhile } from '@etlx/operators/core'
import { isNullOrUndefined } from '@etlx/operators/utils'
import { log, Logger } from '@etlx/operators/@internal/log'
import { fromJsonRequest, FromRequestOptions, authBasic } from '@etlx/operators/http'

import { ConfluencePage, ConfluenceConfig, ConfluencePageExpandable, ConfluencePaginatedResponse } from './types'


export type GetSpacePagesOptions = ConfluenceConfig & {
    limit?: number,
    expand?: Array<ConfluencePageExpandable>,
}

type Response = ConfluencePaginatedResponse<ConfluencePage>

const logRequest = (logger: Logger, request: any) =>
    logger.info(`Loading ${request.url.query.limit} pages from '${request.url.query.spaceKey}' space`)

const getSpacePage = (opts: GetSpacePagesOptions) => (spaceKey?: string) => (start: number) => {
    let request: FromRequestOptions = {
        url: {
            host: opts.confluence.host,
            path: '/rest/api/content',
            query: {
                spaceKey,
                start,
                limit: opts.limit || 20,
                type: 'page',
                status: 'current',
                expand: isNullOrUndefined(opts.expand) ? undefined : opts.expand.join(','),
            },
        },
        headers: authBasic(opts.confluence),
        logger: opts.logger,
    }

    return of(request).pipe(
        log(opts, logRequest, 'confluence'),
        mergeMap(x => fromJsonRequest<Response>(x)),
    )
}

export const getSpaceContent = (opts: GetSpacePagesOptions) => ($: Observable<string | undefined>) => $.pipe(
    map(getSpacePage(opts)),
    mergeMap(page => page(0).pipe(
        expandWhile(x => page(x.start + (opts.limit || 20)), x => x.size > 0),
        mergeMap(x => of(...x.results)),
    )),
)
