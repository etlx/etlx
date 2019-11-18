import { OperatorFunction } from 'rxjs'
import { JSDOM } from 'jsdom'
import { map } from 'rxjs/operators'
import { getDom } from './utils'

export const parse = (): OperatorFunction<string, JSDOM> => stream => stream.pipe(
    map(getDom),
)