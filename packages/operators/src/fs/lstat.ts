import fs from 'fs'
import { Observable } from 'rxjs'
import { mergeMap } from 'rxjs/operators'

export const lstat = (filepath?: string) => ($: Observable<void | string>) => $.pipe(
    mergeMap(x => new Observable<fs.Stats>((observer) => {
        let path = typeof x === 'string' ? x : filepath
        if (typeof path !== 'string') {
            observer.error(new Error('Invalid path. Path must be supplied either as operator options or as a stream value.'))
            return
        }

        fs.lstat(path, (error, stats) => {
            if (error) {
                observer.error(error)
            } else {
                observer.next(stats)
                observer.complete()
            }
        })
    })),
)
