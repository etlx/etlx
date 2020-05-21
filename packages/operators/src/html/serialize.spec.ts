import { of } from 'rxjs'
import { JSDOM } from 'jsdom'
import { stringifyBody, serialize } from './serialize'
import { wrapHtml } from '../@internal/testing/html'


describe('stringify', () => {
  it('can stringify body', async () => {
    let html = '<p>test</p>'
    let dom = new JSDOM(html)

    let actual = await stringifyBody()(of(dom)).toPromise()

    expect(actual).toEqual(html)
  })

  it('can stringify empty body', async () => {
    let dom = new JSDOM('')

    let actual = await stringifyBody()(of(dom)).toPromise()

    expect(actual).toEqual('')
  })

  it('can serialize html', async () => {
    let html = '<p>test</p>'
    let dom = new JSDOM(html)

    let actual = await serialize()(of(dom)).toPromise()

    expect(actual).toEqual(wrapHtml(html))
  })
})
