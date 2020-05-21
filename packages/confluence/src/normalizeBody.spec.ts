import { promisifyLast } from '@etlx/operators/@internal/utils'
import { mockFetch } from '@etlx/operators/@internal/testing/fetch'
import { normalizeBody } from './normalizeBody'
import { page, confluence } from './@internal/testing'
import { ConfluencePageBody } from './types'
import { getPageBody } from './utils'

const sut = promisifyLast(normalizeBody)

const body = (value: string): { body: ConfluencePageBody } =>
    ({ body: { view: { value, representation: 'view' } } })

describe('normalizeBody', () => {
    it('skip empty body', async () => {
        let data = page(body(''))

        let expected = ''
        let actual = getPageBody(await sut(data, { confluence }))

        expect(actual).toEqual(expected)
    })

    it('return only body contents', async () => {
        let html = '<html><head></head><body><p>Text</p></body></html>'
        let data = page(body(html))

        let expected = '<p>Text</p>'
        let actual = getPageBody(await sut(data, { confluence }))

        expect(actual).toEqual(expected)
    })

    it('leave simple html intact', async () => {
        let html = '<p>Text</p>'
        let data = page(body(html))

        let expected = html
        let actual = getPageBody(await sut(data, { confluence }))

        expect(actual).toEqual(expected)
    })

    it('remove attributes', async () => {
        let html = '<p class="remove">Text</p>'
        let data = page(body(html))

        let expected = '<p>Text</p>'
        let actual = getPageBody(await sut(data, { confluence }))

        expect(actual).toEqual(expected)
    })

    it('preserve <a> src attribute', async () => {
        let html = '<a class="remove" href="http://example.com/">One</a>'
        let data = page(body(html))

        let expected = '<a href="http://example.com/">One</a>'
        let actual = getPageBody(await sut(data, { confluence }))

        expect(actual).toEqual(expected)
    })

    it('preserve <img> src attribute', async () => {
        let html = '<img class="remove" src="http://example.com/">'
        let data = page(body(html))

        let expected = '<img src="http://example.com/">'
        let actual = getPageBody(await sut(data, { confluence }))

        expect(actual).toEqual(expected)
    })

    it('make relative links absolute', async () => {
        let html = '<a src="/page/1/">Text</a>'
        let data = page(body(html))

        let expected = '<a src="http://localhost/page/1/">Text</a>'
        let actual = getPageBody(await sut(data, { confluence }))

        expect(actual).toEqual(expected)
    })

    it('minify html', async () => {
        let html = `
<div>
    <p>One</p>
    <div>
        <p>Two</p>
    </div>
</div>`

        let data = page(body(html))

        let expected = '<div><p>One</p><div><p>Two</p></div></div>'
        let actual = getPageBody(await sut(data, { confluence }))

        expect(actual).toEqual(expected)
    })

    it('can inline images', async () => {
        let headers = new Headers([['content-type', 'image/png']])
        let response = new Response('img-bytes', { headers })
        mockFetch(x => x.mockReturnValueOnce(Promise.resolve(response)))

        let html = '<img src="img.png">'
        let data = page(body(html))

        let expected = '<img src="data:image/png;base64, aW1nLWJ5dGVz">'
        let actual = getPageBody(await sut(data, { confluence, inlineImages: true }))

        expect(actual).toEqual(expected)
    })
})
