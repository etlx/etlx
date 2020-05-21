import { Observable, OperatorFunction } from 'rxjs'

const apply = <A, B>(x: A) => (f: (x: A) => B) => f(x)

type Obs<A = any> = Observable<A>
type Op<A = any, B = any> = OperatorFunction<A, B>

type Map<A = any, B = any> = (xs: Observable<A>[]) => Observable<B>
type MapVar<A = any, B = any> = (...xs: Observable<A>[]) => Observable<B>
type Curry<A = any, B = any> = <T>(ops: Op<T, A>[]) => Op<T, B>

export function combine<A, B, C = B>(combinator: Map<B, C>, ops: Op<A, B>[]): Op<A, C>
export function combine<A, B = A>(combinator: Map<A, B>): Curry<A, B>
export function combine(combinator: Map, operators?: Op[]) {
    return operators === undefined
        ? (ops: Op[]) => ($: Obs) => combinator(ops.map(apply($)))
        : ($: Obs) => combinator(operators.map(apply($)))
}

export function combineVaradic<A, B, C = B>(combinator: MapVar<B, C>, ops: Op<A, B>[]): Op<A, C>
export function combineVaradic<A, B = A>(combinator: MapVar<A, B>): Curry<A, B>
export function combineVaradic(combinator: MapVar, operators?: Op[]) {
    return operators === undefined
        ? (ops: Op[]) => ($: Obs) => combinator(...ops.map(apply($)))
        : ($: Obs) => combinator(...operators.map(apply($)))
}
