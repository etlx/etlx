import { JSDOM } from 'jsdom'
import { stringifyBody, serialize } from './serialize'
import { of } from 'rxjs'
import { wrapHtml } from './testUtils'


describe('stringify', () => {
    it('can stringify body', async () => {
        const html = '<p>test</p>'
        const dom = new JSDOM(html)

        const actual = await stringifyBody()(of(dom)).toPromise()

        expect(actual).toEqual(html)
    })

    it('can stringify empty body', async () => {
        const dom = new JSDOM('')

        const actual = await stringifyBody()(of(dom)).toPromise()

        expect(actual).toEqual('')
    })

    it('can serialize html', async () => {
        const html = '<p>test</p>'
        const dom = new JSDOM(html)

        const actual = await serialize()(of(dom)).toPromise()

        expect(actual).toEqual(wrapHtml(html))
    })
})