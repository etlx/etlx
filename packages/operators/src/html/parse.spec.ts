import { of } from 'rxjs'
import { parse } from './parse'
import { wrapHtml } from '../@internal/testing/html'

describe('parse', () => {
    it('can parse', async () => {
        let html = '<p>test</p>'

        let dom = await parse()(of(html)).toPromise()

        let actual = dom.window.document.querySelector('p')

        expect(actual).not.toBeNull()
        expect(actual!.outerHTML).toEqual(html)
    })

    it('can parse invalid HTML', async () => {
        let html = '<p>test</a>'

        let dom = await parse()(of(html)).toPromise()

        let actual = dom.serialize()

        expect(actual).toEqual(wrapHtml('<p>test</p>'))
    })
})
