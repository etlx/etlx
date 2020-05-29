import { mockFetch } from '@etlx/operators/@internal/testing/fetch'
import { page, respondWith, confluence } from './@internal/testing'
import { fetchPage, FetchPageOptions } from './fetchPage'

describe('fetchPage', () => {
  it('return page unchanged', async () => {
    mockFetch(respondWith(page()))

    let actual = await fetchPage('test', { confluence }).toPromise()
    let expected = page()

    expect(actual).toEqual(expected)
  })

  it('pass options', async () => {
    let fn = mockFetch(respondWith(page()))

    let opts: FetchPageOptions = { version: 1, expand: ['body', 'children'], status: 'current' }

    await fetchPage('test', { confluence }, opts).toPromise()

    let actual = fn.mock.calls[0][0]
    let expected = `${confluence.host}/rest/api/content/test?version=1&status=current&expand=${escape('body,children')}`

    expect(actual).toEqual(expected)
  })
})
