import { Observable } from 'rxjs'
import { concatMap } from 'rxjs/operators'
import { Store } from './types'

export const cache = <T>(data: Observable<T>, store: Store<T>) =>
  store.exists().pipe(
    concatMap(exists => exists
      ? store.read()
      : data.pipe(store.write)),
  )
