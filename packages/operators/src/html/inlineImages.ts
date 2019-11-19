import { JSDOM } from 'jsdom'
import { OperatorFunction, of, from } from 'rxjs'
import { isNullOrUndefined } from 'util'
import { mergeMap, filter, map, toArray } from 'rxjs/operators'
import { authBasic, ensureSuccessStatusCode } from '../utils/http'
import { notNullOrUndefined } from '../utils'
import { getDom } from './utils'
import { mapNode } from './iterate'


export function inlineImages(options?: { host?: string, username?: string, password?: string }): OperatorFunction<JSDOM | string, any> {
    const opts = options || {}
    const hasCredentials = opts.username !== undefined && opts.password !== undefined
    const headers = hasCredentials
        ? authBasic({ username: opts.username!, password: opts.password! })
        : undefined


    return stream => stream.pipe(
        mergeMap((input) => {
            const dom = getDom(input)

            return of(dom).pipe(
                mapNode((node) => {
                    if (node.nodeName !== 'IMG') return undefined

                    const element = node as HTMLElement
                    const src = element.getAttribute('src')

                    if (isNullOrUndefined(src)) return undefined

                    const url = opts.host === undefined ? src : new URL(src, opts.host).toJSON()

                    return fetchImage(url, headers)
                    .then(({ base64, mime }) => element.setAttribute('src', `data:${mime};base64, ${base64}`))
                    .catch(x => console.error(x))
                }),
                filter(notNullOrUndefined),
                toArray(),
                mergeMap(x => from(Promise.all(x))),
                map(() => dom),
            )
        }),
    )
}

async function fetchImage(url: string, headers: any) {
    const resp = await fetch(url, { headers })

    ensureSuccessStatusCode(resp)

    const contentType = resp.headers.get('content-type')

    if (contentType === null || !contentType.startsWith('image/')) {
        throw new Error('Response Content-Type is not found or is not an image')
    }

    const mime = getMediaType(contentType)

    return resp.arrayBuffer().then(buffer => ({
        mime,
        base64: toBase64(buffer),
    }))
}

function getMediaType(contentType: string) {
    return contentType.split(';')[0]
}

function toBase64(buffer: ArrayBuffer) {
    const bytes = new Uint8Array(buffer)
    const binary = bytes.reduce((acc, x) => acc + String.fromCharCode(x), '')

    return btoa(binary)
}