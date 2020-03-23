import { pipe } from 'rxjs'
import { jsonResponse, returnOnce }  from '@etlx/operators/@internal/testing/fetch'
import { ConfluencePaginatedResponse, ConfluencePage } from '../../types'

export const dataPage = <T>(...results: T[]): ConfluencePaginatedResponse<T> => ({
    results,
    start: 0,
    limit: results.length,
    size: 0,
})

export const page = (rest?: Partial<ConfluencePage>): ConfluencePage => ({
    id: '0',
    title: 'test',
    status: 'current',
    type: 'page',
    _links: {
        self: '',
        tinyui: '',
        webui: '',
    },
    extensions: undefined,
    ...rest,
})

export const respondWith = pipe(dataPage, jsonResponse, returnOnce)
export const confluence = { host: 'http://localhost', username: '', password: '' }