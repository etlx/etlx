import { merge as rxMerge, concat as rxConcat, Observable as rxObservable } from 'rxjs'

type Subscription = {
    unsubscribe(): void;
}

interface Observer<T> {
    closed?: boolean
    next: (value: T) => void
    error: (err: any) => void
    complete: () => void
}

export type Observable<T> = {
    subscribe(observer?: Observer<T>): Subscription;
}

export function isObservable<T>(obj: any): obj is Observable<T> {
    return typeof obj?.subscribe === 'function'
}

export function merge<T>(...xs: Observable<T>[]): Observable<T> {
    return rxMerge(...xs.map(toObservable))
}

export function concat<T>(...xs: Observable<T>[]): Observable<T> {
    return rxConcat(...xs.map(toObservable))
}


function toObservable<T>($: Observable<T>): rxObservable<T> {
    return new rxObservable(x => $.subscribe(x))
}
