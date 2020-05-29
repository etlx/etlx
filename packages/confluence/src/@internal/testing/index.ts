import { pipe } from 'rxjs'
import { jsonResponse, returnOnce } from '@etlx/operators/@internal/testing/fetch'
import { dataPage } from './data'

export * from './data'

export const confluence = { host: 'http://localhost', username: '', password: '' }

export const respondWith = pipe(jsonResponse, returnOnce)
export const respondManyWith = pipe(dataPage, respondWith)

export const mockSequence = <T>(...xs: T[]) => (init: jest.Mock<T>) =>
  xs.reduce((prev, next) => prev.mockReturnValueOnce(next), init)

export const respondSeq = (...xs: any[]) => mockSequence(...xs.map(jsonResponse))
