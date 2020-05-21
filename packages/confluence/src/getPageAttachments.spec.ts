import url from 'url'
import { promisify } from '@etlx/operators/@internal/utils'
import { mockFetch, jsonResponse } from '@etlx/operators/@internal/testing/fetch'
import { confluence, page, dataPage, respondWith } from './@internal/testing'
import { getPageAttachments } from './getPageAttachments'
import { ConfluenceAttachment, ConfluencePage } from './types'

let sut = promisify(getPageAttachments)

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

const pageWithAttachments = (rest: Partial<ConfluencePage>, ...attachments: ConfluenceAttachment[]) => page({
    ...rest,
    descendants: {
        attachment: {
            ...dataPage(...attachments),
            limit: 1,
        },
    },
})

describe('getPageAttachments', () => {
    it('can get single page', async () => {
        mockFetch(respondWith(attachment()))

        let actual = await sut(page(), { confluence })

        let expected = [pageWithAttachments(page(), attachment())]

        expect(actual).toEqual(expected)
    })

    it('can paginate', async () => {
        mockFetch((mock) => {
            let data = dataPage(attachment())
            let r1 = jsonResponse({ ...data, size: 2 })
            let r2 = jsonResponse({ ...data, size: 0 })

            return mock.mockReturnValueOnce(r1).mockReturnValueOnce(r2)
        })

        let actual = await sut(page(), { confluence })

        let expected = [pageWithAttachments(page(), attachment(), attachment())]

        expect(actual).toEqual(expected)
    })

    it('can make correct Confluence request', async () => {
        let { mock } = mockFetch(respondWith(attachment()))
        let init = page()

        await sut(init, { confluence, limit: 1, mediaType: 'type', filename: 'filename' })

        expect(mock.calls).toHaveLength(1)

        let [request] = mock.calls[0]
        let requestUrl = typeof request === 'string' ? request : request.url
        let { path: actual } = url.parse(requestUrl)

        let expected = `/rest/api/content/${init.id}/child/attachment?start=0&limit=1&mediaType=type&filename=filename`

        expect(actual).toEqual(expected)
    })
})
