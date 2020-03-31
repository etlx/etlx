import fs from 'fs'
import { Observable, of } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import { Validator, empty, ok, error } from '../core/validation'
import { streamIntoFile } from '../fs'
import { lstat } from '../fs/lstat'
import { fromFileStream } from '../fs'

import { Store } from './types'

const parseJson = (x: string) => JSON.parse(x)
const stringify = (x: any) => JSON.stringify(x)

export type FilestoreOptions = {
    validate?: Validator<fs.Stats>,
}

export const filestore = <T>(filepath: string, options?: FilestoreOptions): Store<T> => {
    let opts = options || {}
    let validate = opts.validate || empty<fs.Stats>()

    return {
        exists: () => of(filepath).pipe(
            lstat(),
            catchError(() => of(false)),
            map(x => typeof x === 'boolean' ? x : validate(x).ok),
        ),
        read: () => fromFileStream(filepath, { readline: true }).pipe(
            map<string, T>(parseJson),
        ),
        write: ($: Observable<T>) => $.pipe(
            streamIntoFile(filepath, { value: stringify }),
        ),
    }
}


export const notOlderThan = (ms: number): Validator<fs.Stats> =>
    stats => Date.now() - stats.mtimeMs <= ms ? ok() : error()

export const notEmpty = (): Validator<fs.Stats> =>
    stats => stats.size > 0 ? ok() : error()