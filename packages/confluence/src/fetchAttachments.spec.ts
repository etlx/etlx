import url from 'url'
import { toArray } from 'rxjs/operators'
import { mockFetch, jsonResponse } from '@etlx/operators/@internal/testing/fetch'
import { confluence, page, dataPage, respondManyWith } from './@internal/testing'
import { fetchAttachments, FetchAttachmentsOptions } from './fetchAttachments'
import { ConfluenceAttachment } from './types'

let sut = (id: string, opts?: FetchAttachmentsOptions) =>
  fetchAttachments({ confluence }, id, opts).pipe(toArray()).toPromise()

const attachment = (rest?: Partial<ConfluenceAttachment>): ConfluenceAttachment => ({
  id: 'test',
  title: 'Test',
  type: 'attachment',
  status: 'current',
  extensions: {
    mediaType: 'plain',
    comment: '',
  },
  metadata: {
    mediaType: 'plain',
    comment: '',
  },
  _links: {
    download: '',
    self: '',
  },
  ...rest,
})

describe('fetchAttachments', () => {
  it('single page', async () => {
    mockFetch(respondManyWith(attachment()))

    let actual = await sut('0')

    let expected = [attachment()]

    expect(actual).toEqual(expected)
  })

  it('paginate', async () => {
    mockFetch((mock) => {
      let data = dataPage(attachment())
      let r1 = jsonResponse({ ...data, size: 2 })
      let r2 = jsonResponse({ ...data, size: 0 })

      return mock.mockReturnValueOnce(r1).mockReturnValueOnce(r2)
    })

    let actual = await sut('0')

    let expected = [attachment(), attachment()]

    expect(actual).toEqual(expected)
  })

  it('make correct Confluence request', async () => {
    let { mock } = mockFetch(respondManyWith(attachment()))
    let init = page()

    await sut(init.id, { limit: 1, mediaType: 'type', filename: 'filename' })

    expect(mock.calls).toHaveLength(1)

    let [request] = mock.calls[0]
    let requestUrl = typeof request === 'string' ? request : request.url
    let { path: actual } = url.parse(requestUrl)

    let expected = `/rest/api/content/${init.id}/child/attachment?start=0&limit=1&mediaType=type&filename=filename`

    expect(actual).toEqual(expected)
  })
})
