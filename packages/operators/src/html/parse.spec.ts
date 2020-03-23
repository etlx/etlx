import { parse } from './parse'
import { wrapHtml } from '../@internal/testing/html'
import { of } from 'rxjs'

describe('parse', () => {
    it('can parse', async () => {
        const html = '<p>test</p>'

        const dom = await parse()(of(html)).toPromise()

        const actual = dom.window.document.querySelector('p')

        expect(actual).not.toBeNull()
        expect(actual!.outerHTML).toEqual(html)
    })

    it('can parse invalid HTML', async () => {
        const html = '<p>test</a>'

        const dom = await parse()(of(html)).toPromise()

        const actual = dom.serialize()

        expect(actual).toEqual(wrapHtml('<p>test</p>'))
    })
})