import { mockFetch } from '@etlx/operators/@internal/testing/fetch'
import { page, respondWith, confluence } from './@internal/testing'
import { getPageById, GetPageByIdOptions } from './getPageById'

describe('getPageById', () => {
  it('return page unchanged', async () => {
    mockFetch(respondWith(page()))

    let actual = await getPageById('test', { confluence }).toPromise()
    let expected = page()

    expect(actual).toEqual(expected)
  })

  it('pass options', async () => {
    let fn = mockFetch(respondWith(page()))

    let opts: GetPageByIdOptions = { version: 1, expand: ['body', 'children'], status: 'current' }

    await getPageById('test', { confluence }, opts).toPromise()

    let actual = fn.mock.calls[0][0]
    let expected = `${confluence.host}/rest/api/content/test?version=1&status=current&expand=${escape('body,children')}`

    expect(actual).toEqual(expected)
  })
})
