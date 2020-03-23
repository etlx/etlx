import { OperatorFunction, of } from 'rxjs'
import { concatMap } from 'rxjs/operators'
import { Store } from './types'

export const fromSnapshot = <T>(data: OperatorFunction<void, T>, store: Store<T>) =>
    store.exists().pipe(
        concatMap(exists => exists
            ? store.read()
            : of(undefined).pipe(data, store.write),
        ),
    )

export const snapshot = <T>(data: OperatorFunction<void, T>, store: Store<T>) =>
    () => fromSnapshot(data, store)
