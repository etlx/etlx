import { pipe } from 'rxjs'
import { tap } from 'rxjs/operators'
import { not, throwError } from '../@internal/utils'

export const throwWhen = <T>(predicate: (x: T) => boolean, error: (x: T) => string | Error) =>
    pipe(tap<T>(x => predicate(x) && throwError(error(x))))

export const assert = <T>(predicate: (x: T) => boolean, error: (x: T) => string | Error) =>
    throwWhen(not(predicate), error)