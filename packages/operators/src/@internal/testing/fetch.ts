/* eslint-disable no-param-reassign */

jest.mock('node-fetch')

// eslint-disable-next-line import/first, import/no-extraneous-dependencies
import fetch from 'node-fetch';

((global: any) => {
    let { Response, Headers } = jest.requireActual('node-fetch')

    global.Response = Response
    global.Headers = Headers
    global.fetch = fetch
})(global)

const headers = { 'content-type': 'application/json' }
export const jsonResponse = (body: any) => Promise.resolve<Response>(new Response(JSON.stringify(body), { headers }))
export const faultyResponse = (status: number = 500) => Promise.resolve<Response>(new Response('', { status }))

export const returnOnce = <TOut>(x: TOut) => (mock: jest.Mock<TOut>) => mock.mockReturnValueOnce(x)

export type MockFetch = jest.Mock<Promise<Response>, [RequestInfo, RequestInit | undefined]>
export function mockFetch(f?: (x: MockFetch) => MockFetch): MockFetch {
    let mock: MockFetch = fetch as any
    mock.mockClear()

    return f === undefined ? mock : f(mock)
}
