import url from 'url'
import { promisify } from '@etlx/operators/@internal/utils'
import { mockFetch, jsonResponse } from '@etlx/operators/@internal/testing/fetch'
import { getSpaceContent } from './getSpaceContent'
import { respondManyWith, page, dataPage, confluence } from './@internal/testing'


const sut = promisify(getSpaceContent)

describe('getSpaceContent', () => {
  it('can get single page', async () => {
    mockFetch(respondManyWith(page()))

    let expected = [page()]

    let actual = await await sut('space', { confluence })

    expect(actual).toEqual(expected)
  })

  it('can paginate', async () => {
    mockFetch((mock) => {
      let data = dataPage(page())
      let r1 = jsonResponse({ ...data, size: 2 })
      let r2 = jsonResponse({ ...data, size: 0 })

      return mock.mockReturnValueOnce(r1).mockReturnValueOnce(r2)
    })

    let expected = [page(), page()]

    let actual = await await sut('space', { confluence })

    expect(actual).toEqual(expected)
  })

  it('can make correct Confluence request', async () => {
    let { mock } = mockFetch(respondManyWith(page()))

    await sut('space', { confluence })

    expect(mock.calls).toHaveLength(1)

    let [request] = mock.calls[0]
    let requestUrl = typeof request === 'string' ? request : request.url
    let { path: actual } = url.parse(requestUrl)

    let expected = '/rest/api/content?spaceKey=space&start=0&limit=20&type=page&status=current'

    expect(actual).toEqual(expected)
  })
})
