import { Observable, interval, observable } from 'rxjs'
import { mergeMap } from 'rxjs/operators'
const parseDuration = require('parse-duration')

export function every(opts: string | number) {
    const ms = typeof opts === 'number' ? opts : parseDuration(opts)

    return (stream: Observable<void>) => stream.pipe(
        mergeMap(() => interval(ms)),
    )
}
