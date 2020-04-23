import { Observable, OperatorFunction, pipe, partition as partitionStatic, identity, merge } from 'rxjs'


type Fn<A, B> = (a: A) => B
type P<A> = Fn<A, boolean>
type Op<A, B> = OperatorFunction<A, B>
type Tuple<A, B> = [A, B]


const partition = <A>(p: (x: A) => boolean) => ($: Observable<A>) => partitionStatic($, p)

const mapTuple = <A1, B1, A2, B2>(fa: Fn<A1, A2>, fb: Fn<B1, B2>) =>
    ([a, b]: Tuple<A1, B1>): Tuple<A2, B2> => [fa(a), fb(b)]


export function condition<A>(predicate: (x: A) => boolean, ifTrue: OperatorFunction<A, A>): OperatorFunction<A, A>
export function condition<A>(predicate: (x: A) => boolean, ifTrue: OperatorFunction<A, A>, ifFalse: OperatorFunction<A, A>): OperatorFunction<A, A>
export function condition<A, B>(predicate: (x: A) => boolean, ifTrue: OperatorFunction<A, B>): OperatorFunction<A, B>
export function condition<A, B>(predicate: (x: A) => boolean, ifTrue: OperatorFunction<A, B>, ifFalse: OperatorFunction<A, B>): OperatorFunction<A, B>
export function condition<A, B, C>(predicate: (x: A) => boolean, ifTrue: OperatorFunction<A, B>, ifFalse: OperatorFunction<A, C>): OperatorFunction<A, B | C>
export function condition<A, B>(p: P<A>, ifTrue: Op<A, B>, ifFalsy?: Op<A, B>) {
    let ifFalse: Op<A, A | B> = ifFalsy || identity

    return pipe(
        partition<A>(p),
        mapTuple(pipe(ifTrue), pipe(ifFalse)),
        xs => merge(...xs),
    )
}
