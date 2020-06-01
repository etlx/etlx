import { toArray } from 'rxjs/operators'
import { mockFetch } from '@etlx/operators/@internal/testing/fetch'
import { fetchContent, FetchContentOptions } from './fetchContent'
import { respondManyWith, page, dataPage, confluence, respondSeq } from './@internal/testing'

const sut = (opts?: FetchContentOptions) =>
  fetchContent({ confluence }, opts).pipe(toArray()).toPromise()

describe('getSpaceContent', () => {
  it('can get single page', async () => {
    mockFetch(respondManyWith(page()))

    let expected = [page()]

    let actual = await sut()

    expect(actual).toEqual(expected)
  })

  it('can paginate', async () => {
    mockFetch(respondSeq(
      { ...dataPage(page()), size: 2 },
      { ...dataPage(page()), size: 0 },
    ))

    let expected = [page(), page()]

    let actual = await sut()

    expect(actual).toEqual(expected)
  })

  it('can make correct Confluence request', async () => {
    let { mock } = mockFetch(respondManyWith(page()))

    let opts: FetchContentOptions = {
      expand: ['body', 'ancestors'],
      limit: 50,
      orderby: 'title',
      postingDay: '2020-05-29',
      spaceKey: 'ABC',
      status: 'current',
      title: 'Title',
      trigger: 'viewed',
      type: 'page',
    }

    await sut(opts)

    expect(mock.calls).toHaveLength(1)

    let [[request]] = mock.calls

    let actual = typeof request === 'string' ? request : request.url
    let expected = `${confluence.host}/rest/api/content`
      + '?start=0'
      + `&expand=${escape('body,ancestors')}`
      + '&limit=50'
      + '&type=page'
      + '&status=current'
      + '&orderby=title'
      + '&postingDay=2020-05-29'
      + '&spaceKey=ABC'
      + '&title=Title'
      + '&trigger=viewed'

    expect(actual).toEqual(expected)
  })
})
