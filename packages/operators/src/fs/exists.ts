import fs from 'fs'
import { Observable } from 'rxjs'
import { mergeMap } from 'rxjs/operators'

export const exists = (filepath?: string) => ($: Observable<void | string>) => $.pipe(
    mergeMap(x => new Observable<boolean>((observer) => {
        let path = typeof x === 'string' ? x : filepath
        if (typeof path !== 'string') {
            observer.error(new Error('Invalid path. Path must be supplied either as operator options or as a stream value.'))
            return
        }

        fs.access(path, fs.constants.F_OK, (err) => {
            let exists = err === null

            observer.next(exists)
            observer.complete()
        })
    })),
)
