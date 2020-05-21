import { pipe } from 'rxjs'
import { fromJsonRequest, fromRequest, UrlParams } from './request'
import { mockFetch, returnOnce } from '../@internal/testing/fetch'

type JsonResponse = { body: any, contentType?: string, status?: number }
const jsonResponse = (res: JsonResponse) => new Response(JSON.stringify(res.body), {
    headers: new Headers([
        ['content-type', res.contentType || 'application/json'],
    ]),
    status: res.status || 200,
    statusText: 'OK',
})

const respondJsonOnce = pipe(jsonResponse, x => Promise.resolve(x), returnOnce)

describe('fromRequest', () => {
    it('leave response intact', () => {
        let expected = Promise.resolve(new Response('test', {
            headers: new Headers([['content-type', 'text/plain']]),
            status: 200,
            statusText: 'GOOD',
        }))
        mockFetch(returnOnce(expected))

        let actual = fromRequest({ url: 'http://example.com' }).toPromise()

        expect(actual).toEqual(expected)
    })

    it('format url', async () => {
        let mock = mockFetch(returnOnce(Promise.resolve(new Response())))

        let url: UrlParams = {
            host: 'http://example.com',
            path: '/search/',
            query: { a: 1, b: 'text', c: true },
        }

        await fromRequest({ url }).toPromise()

        let actual = mock.mock.calls[0][0]
        let expected = 'http://example.com/search/?a=1&b=text&c=true'

        expect(actual).toEqual(expected)
    })
})

describe('fromJsonRequest', () => {
    it('parse json response', async () => {
        let body = {
            a: 42,
            b: { c: 'test' },
        }

        mockFetch(respondJsonOnce({ body }))

        let actual = await fromJsonRequest({ url: '' }).toPromise()

        let expected = body

        expect(actual).toEqual(expected)
    })

    it('throws on non-success codes', async () => {
        mockFetch(respondJsonOnce({ body: {}, status: 500 }))

        let actual = fromJsonRequest({ url: '' }).toPromise()

        await expect(actual).rejects.toThrow(new Error('Response status code (500) does not indicate success'))
    })

    it('throws on non-json media type', async () => {
        mockFetch(respondJsonOnce({ body: {}, contentType: 'text/plain' }))

        let actual = fromJsonRequest({ url: '' }).toPromise()

        await expect(actual).rejects.toThrow(new Error('Response media type is unexpected. Server responded with text/plain, but application/json is expected'))
    })

    it('force json parse', async () => {
        let body = { a: 42 }
        mockFetch(respondJsonOnce({ body, contentType: 'text/plain' }))

        let actual = await fromJsonRequest({ url: '', parseNonJsonMediaTypes: true }).toPromise()

        let expected = body

        expect(actual).toEqual(expected)
    })
})
