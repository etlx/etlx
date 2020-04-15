import { from, throwError } from 'rxjs'
import { mergeMap } from 'rxjs/operators'
import { fromFetch } from 'rxjs/fetch'
import { log, Logger, LoggerConfig } from '../@internal/log'
import { formatUrl } from './utils'
import { invalidMediaType, faultyResponse } from './errors'

export type UrlParams = {
    host: string,
    path: string,
    query: { [key: string]: undefined | null | string | number | boolean },
}

export type FromRequestOptions = RequestInit & LoggerConfig & {
    url: string | UrlParams,
}

const logResponse = (logger: Logger, response: Response) =>
    logger.info(`${response.status} - ${response.url}`)

export function fromRequest(request: FromRequestOptions) {
    let { url, logger, ...init } = request
    let urlString = getUrl(url)

    return fromFetch(urlString, init).pipe(
        log(request, logResponse, 'http'),
    )
}

export type FromJsonRequestOptions = FromRequestOptions & {
    parseNonJsonMediaTypes?: boolean,
}
export function fromJsonRequest<T = any>(request: FromJsonRequestOptions) {
    return fromRequest(request).pipe(
        mergeMap(response =>
            response.ok
            ? parseJson<T>(request, response)
            : throwError(faultyResponse(response)),
        ),
    )
}

function parseJson<T>(req: FromJsonRequestOptions, res: Response) {
    let contentType = res.headers.get('content-type') || ''
    let [mediaType] = contentType.toLowerCase().split(';')
    let canParse = mediaType === 'application/json' || req.parseNonJsonMediaTypes

    return canParse
        ? from(res.json() as Promise<T>)
        : throwError(invalidMediaType(contentType, 'application/json'))
}

function getUrl(url: UrlParams | string) {
    return typeof url === 'string' ? url : formatUrl(url.path, url)
}