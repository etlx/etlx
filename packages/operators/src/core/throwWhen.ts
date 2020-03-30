import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { not, throwError } from '../utils'

export const throwWhen = <T>(predicate: (x: T) => boolean, error: (x: T) => string | Error) =>
    ($: Observable<T>) => $.pipe(
        tap(x => predicate(x) && throwError(error(x))),
    )

export const assert = <T>(predicate: (x: T) => boolean, error: (x: T) => string | Error) =>
    throwWhen(not(predicate), error)