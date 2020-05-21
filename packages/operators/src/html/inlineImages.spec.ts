import { JSDOM } from 'jsdom'
import { mockFetch, returnOnce, faultyResponse } from '../@internal/testing/fetch'
import { inlineImages } from './inlineImages'
import { promisifyLast } from '../@internal/utils'
import { invalidMediaType } from '../http'

const host = 'http://example.com'
const png = 'image/png'

const sut = promisifyLast(inlineImages)
const body = (dom: JSDOM) => dom.window.document.body.innerHTML
const respondWithImage = (contentType: string) => Promise.resolve(
    new Response('img-bytes', {
        headers: { 'content-type': contentType },
    }),
)

describe('inlineImages', () => {
    it('inline single image', async () => {
        mockFetch(returnOnce(respondWithImage(png)))

        let init = '<img src="img.png">'

        let actual = await sut(init, { host }).then(body)
        let expected = '<img src="data:image/png;base64, aW1nLWJ5dGVz">'

        expect(actual).toEqual(expected)
    })

    it('inline multiple images', async () => {
        mockFetch((x) => {
            returnOnce(respondWithImage(png))(x)
            returnOnce(respondWithImage(png))(x)

            return x
        })

        let init = '<img src="img.png"><img src="img2.png">'

        let actual = await sut(init, { host }).then(body)
        let expected = '<img src="data:image/png;base64, aW1nLWJ5dGVz">'
                     + '<img src="data:image/png;base64, aW1nLWJ5dGVz">'

        expect(actual).toEqual(expected)
    })

    it('preserve non-images', async () => {
        let init = '<h1>Title</h1><p class="text">Text</p>'

        let actual = await sut(init, { host }).then(body)
        let expected = init

        expect(actual).toEqual(expected)
    })

    it('throw on invalid images', async () => {
        mockFetch(returnOnce(respondWithImage('text/plain')))

        let init = '<img src="img.png">'

        let actual = sut(init, { host }).then(body)

        await expect(actual).rejects.toThrow(invalidMediaType('text/plain', 'image/*'))
    })

    it('skip faulty response', async () => {
        mockFetch(returnOnce(faultyResponse()))

        let init = '<img src="img.png">'

        let actual = await sut(init, { host, skipOnError: true }).then(body)
        let expected = init

        expect(actual).toEqual(expected)
    })

    it('skip invalid images', async () => {
        mockFetch(returnOnce(respondWithImage('text/plain')))

        let init = '<img src="img.png">'

        let actual = await sut(init, { host, skipOnError: true }).then(body)
        let expected = init

        expect(actual).toEqual(expected)
    })
})
