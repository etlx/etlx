import { from, throwError, Observable } from 'rxjs'
import { mergeMap } from 'rxjs/operators'
import { fromFetch } from 'rxjs/fetch'
import { LoggerFactory, Logger } from '../utils'
import { formatUrl } from './utils'
import { log } from '..'

export type UrlParams = {
    host: string,
    path: string,
    query: { [key: string]: undefined | null | string | number | boolean },
}

export type FromRequestOptions = RequestInit & {
    url: string | UrlParams,
    logger?: LoggerFactory,
}

const logResponse = (logger: Logger, response: Response) =>
    logger.info(`${response.status} - ${response.url}`)

export function fromRequest(request: FromRequestOptions) {
    let { url, logger, ...init } = request
    let urlString = getUrl(url)

    return fromFetch(urlString, init).pipe(
        log(logger, logResponse, 'http'),
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
            : throwError(new Error(`Response status code (${response.status}) does not indicate success`)),
        ),
    )
}

function parseJson<T>(req: FromJsonRequestOptions, res: Response) {
    let contentType = res.headers.get('content-type') || ''
    let [mediaType] = contentType.toLowerCase().split(';')
    let canParse = mediaType === 'application/json' || req.parseNonJsonMediaTypes

    return canParse
        ? from(res.json() as Promise<T>)
        : throwError(new Error(`Response content-type (${contentType}) does not indicate json payload`))
}

function getUrl(url: UrlParams | string) {
    return typeof url === 'string' ? url : formatUrl(url.path, url)
}