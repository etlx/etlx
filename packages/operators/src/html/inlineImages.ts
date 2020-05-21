import { JSDOM } from 'jsdom'
import { OperatorFunction, of, from, throwError, empty, identity } from 'rxjs'
import { mergeMap, map, mapTo, defaultIfEmpty } from 'rxjs/operators'
import { isNullOrUndefined } from '../@internal/utils'
import { fromRequest, invalidMediaType, faultyResponse, authBasic, formatUrl } from '../http'

import { getDom } from './utils'
import { mapNode } from './iterate'


export type InlineImagesOptions = {
  host?: string,
  username?: string,
  password?: string,
  skipOnError?: boolean,
}

type Image = { mime: string, base64: string }

export function inlineImages(options?: InlineImagesOptions): OperatorFunction<JSDOM | string, JSDOM> {
  let opts = options || {}

  return $ => $.pipe(
    mergeMap((input) => {
      let dom = getDom(input)

      return of(dom).pipe(
        mapNode(updateImage(opts)),
        mergeMap(identity),
        mapTo(dom),
        defaultIfEmpty(dom),
      )
    }),
  )
}

function updateImage(opts: InlineImagesOptions) {
  let hasCredentials = opts.username !== undefined && opts.password !== undefined
  let headers = hasCredentials
    ? authBasic({ username: opts.username!, password: opts.password! })
    : undefined

  return (node: Node) => {
    if (node.nodeName !== 'IMG') return empty()

    let element = node as HTMLElement
    let src = element.getAttribute('src')

    if (isNullOrUndefined(src)) return empty()

    let resp$ = fromRequest({
      url: formatUrl(src, opts),
      headers,
    })

    return resp$.pipe(
      mergeMap(toImage(opts)),
      map(updateImageSrc(element)),
    )
  }
}

function updateImageSrc(element: HTMLElement) {
  return ({ base64, mime }: Image) => {
    element.setAttribute('src', `data:${mime};base64, ${base64}`)

    return element
  }
}

function toImage(opts: InlineImagesOptions) {
  return (response: Response) => {
    if (!response.ok) {
      return opts.skipOnError
        ? empty()
        : throwError(faultyResponse(response))
    }

    let contentType = response.headers.get('content-type') || ''
    let [mime] = contentType.split(';')

    if (!contentType.startsWith('image/')) {
      return opts.skipOnError
        ? empty()
        : throwError(invalidMediaType(mime, 'image/*'))
    }

    return from(response.arrayBuffer()).pipe(
      map(toBase64),
      map(base64 => ({ base64, mime } as Image)),
    )
  }
}

function toBase64(buffer: ArrayBuffer) {
  let appendCode = (xs: string, code: number) => xs + String.fromCharCode(code)
  let binary = new Uint8Array(buffer).reduce(appendCode, '')

  return btoa(binary)
}
