import { from, OperatorFunction, identity, pipe } from 'rxjs'
import { toArray, map, mergeMap } from 'rxjs/operators'

type SortFn<T> = (a: T, b: T) => number

// eslint-disable-next-line no-nested-ternary
const gt = (a: any, b: any) => a === b ? 0 : a > b ? 1 : -1
const lt = (a: any, b: any) => 0 - gt(a, b)
const gtSeq = compareArrays
const ltSeq = (a: any[], b: any[]) => 0 - compareArrays(a, b)

export const ascending = composeSort(gt)
export const descending = composeSort(lt)
export const ascendingSeq = composeSort(gtSeq)
export const descendingSeq = composeSort(ltSeq)

export function composeSort<B = any>(compare: SortFn<B>) {
    return function inner<A>(select?: (a: A) => B) {
        let f = select || identity as any
        return (a: A, b: A) => compare(f(a), f(b))
    }
}

export function combineSort<T>(...fns: SortFn<T>[]): SortFn<T> {
    return (a, b) => fns.reduce(
        (n, f) => n === 0 ? f(a, b) : n,
        0,
    )
}

export function sort<A>(f: (a: A, b: A) => number): OperatorFunction<A, A> {
    return pipe(
        toArray(),
        map(xs => xs.sort(f)),
        mergeMap(from),
    )
}


function compareArrays(a: any[], b: any[]) {
    if (a.length > b.length) return 1
    if (b.length > a.length) return -1

    for (let i = 0; i < a.length; i++) {
        if (a[i] > b[i]) return 1
        if (b[i] > a[i]) return -1
    }

    return 0
}
