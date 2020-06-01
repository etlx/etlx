import url from 'url'
import { of } from 'rxjs'
import { toArray } from 'rxjs/operators'
import { mockFetch, MockFetch } from '@etlx/operators/@internal/testing/fetch'
import { confluence } from './@internal/testing'
import { page, version, history, testDate } from './@internal/testing/data'
import { fetchHistory, FetchHistoryOptions } from './fetchHistory'
import { ConfluencePage } from './types'


const sut = (init: ConfluencePage, opts?: FetchHistoryOptions) => of(init).pipe(
  fetchHistory({ confluence }, opts),
  toArray(),
).toPromise()

describe('fetchHistory', () => {
  // useFrom, useTo, backward, name
  let filterTests: any[] = [
    [0, 0, 0, 'forward; no-filter'],
    [0, 0, 1, 'backward; no-filter'],
    [0, 1, 0, 'forward; filter to'],
    [0, 1, 1, 'backward; filter to'],
    [1, 0, 0, 'forward; filter from'],
    [1, 0, 1, 'backward; filter from'],
    [1, 1, 0, 'forward; filter period'],
    [1, 1, 1, 'backward; filter period'],
  ]
  filterTests.forEach(([useFrom, useTo, backward, name]) => it(name, async () => {
    let min = 1
    let max = 6
    let firstVersion = backward ? max : min
    let from = useFrom ? 3 : min
    let to = useTo ? 4 : max
    let count = to - from + 1

    let opts: FetchHistoryOptions = {
      backward,
      from: useFrom ? testDate(from) : undefined,
      to: useTo ? testDate(to) : undefined,
    }

    mockFetch(getPageApi(max))

    let result = await sut(pageVersion(firstVersion, max), opts)

    let actual = result.map(x => x.number)
    let expected = backward ? range(count, from).reverse() : range(count, from)

    expect(actual).toEqual(expected)
  }))

  it('load missing data if required', async () => {
    let fn = mockFetch(getPageApi(6))

    await sut(page())

    let expected = `${confluence.host}/rest/api/content/0?expand=${escape('version,history.lastUpdated,history.previousVersion,history.nextVersion')}`
    let [[actual]] = fn.mock.calls

    expect(actual).toEqual(expected)
  })

  it('init version starts in the middle', async () => {
    mockFetch(getPageApi(6))

    let results = await sut(pageVersion(4, 6))

    let actual = results.map(x => x.number)
    let expected = range(4, 3)

    expect(actual).toEqual(expected)
  })

  it('minimize network requests', async () => {
    let fn = mockFetch(getPageApi(6))

    await sut(pageVersion(1, 6))

    let expected = Math.ceil(6 / 3)
    let actual = fn.mock.calls.length

    expect(actual).toEqual(expected)
  })

  it('forward; includePeriodInitVersion', async () => {
    let max = 6
    let from = addDays(testDate(2), -42)
    let to = addDays(testDate(3), 42)
    mockFetch(getPageApi(max))

    let results = await sut(pageVersion(1, max), {
      from,
      to,
      includePeriodInitVersion: true,
      backward: false,
    })

    let actual = results.map(x => x.number)
    let expected = range(3, 1)

    expect(actual).toEqual(expected)
  })

  it('backward; includePeriodInitVersion', async () => {
    let max = 6
    let from = addDays(testDate(2), -42)
    let to = addDays(testDate(3), 42)
    mockFetch(getPageApi(max))

    let results = await sut(pageVersion(max, max), {
      from,
      to,
      includePeriodInitVersion: true,
      backward: true,
    })

    let actual = results.map(x => x.number)
    let expected = range(3, 1).reverse()

    expect(actual).toEqual(expected)
  })
})


function addDays(date: Date, days: number): Date {
  let d = new Date(date.valueOf())
  d.setDate(date.getDate() + days)
  return d
}

function range(count: number, start: number = 0) {
  return Array(count).fill(undefined).map((_, i) => i + start)
}

function pageVersion(n: number, max: number) {
  return page({
    version: version(n),
    history: history(n, max),
  })
}

const parseQuery = (q: string): { [key: string]: string } => q
  .split('&')
  .map(x => x.split('='))
  .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {})

function getPageApi(max: number) {
  return (mock: MockFetch) => mock.mockImplementation((req) => {
    let { query: queryString } = url.parse(req.toString())
    let query = parseQuery(queryString || '')
    let currentVersion = query.version === undefined ? max : parseInt(query.version, 10)
    let data = pageVersion(currentVersion, max)

    let body = JSON.stringify(data)
    let headers: ResponseInit = {
      status: currentVersion > max ? 404 : 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }

    return Promise.resolve(new Response(body, headers))
  })
}
