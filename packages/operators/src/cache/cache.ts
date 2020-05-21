import { OperatorFunction, of } from 'rxjs'
import { concatMap } from 'rxjs/operators'
import { Store } from './types'

export const cache = <T>(data: OperatorFunction<void, T>, store: Store<T>) =>
    store.exists().pipe(
        concatMap(exists => exists
            ? store.read()
            : of(undefined).pipe(data, store.write)),
    )
