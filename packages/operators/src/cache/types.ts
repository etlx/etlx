import { Observable, OperatorFunction } from 'rxjs'

export type Store<T> = {
    exists: () => Observable<boolean>,
    read: () => Observable<T>,
    write: OperatorFunction<T, T>,
}