import { OperatorFunction, of } from 'rxjs'
import { toArray } from 'rxjs/operators'

type Op<A, B> = OperatorFunction<A, B>

const promiseLast = <A, B>(op: Op<A, B>, init: A) =>
    of(init).pipe(op).toPromise()

export const promisifyLast = <A extends any[], B, C>(f: (...args: A) => Op<B, C>) =>
    (value: B, ...args: A) => promiseLast(f(...args), value)


const promise = <A, B>(op: Op<A, B>, init: A) =>
    of(init).pipe(op, toArray()).toPromise()

export const promisify = <A extends any[], B, C>(f: (...args: A) => Op<B, C>) =>
    (value: B, ...args: A) => promise(f(...args), value)
