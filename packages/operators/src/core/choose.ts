import { OperatorFunction, pipe, identity } from 'rxjs'


type Op<A, B> = OperatorFunction<A, B>
type Scalar = boolean | number | string | null | undefined

const truthy = (x: (() => Scalar) | Scalar) => typeof x === 'function' ? x() : x

export function choose<A>(condition: (() => Scalar) | Scalar, ifTrue: OperatorFunction<A, A>): OperatorFunction<A, A>
export function choose<A>(condition: (() => Scalar) | Scalar, ifTrue: OperatorFunction<A, A>, ifFalse: OperatorFunction<A, A>): OperatorFunction<A, A>
export function choose<A, B>(condition: (() => Scalar) | Scalar, ifTrue: OperatorFunction<A, B>, ifFalse: OperatorFunction<A, B>): OperatorFunction<A, B>
export function choose<A, B, C>(condition: (() => Scalar) | Scalar, ifTrue: OperatorFunction<A, B>, ifFalse: OperatorFunction<A, C>): OperatorFunction<A, B | C>
export function choose(condition: (() => Scalar) | Scalar, ifTrue: Op<any, any>, ifFalse?: Op<any, any>) {
  if (truthy(condition)) {
    return pipe(ifTrue)
  } else {
    return ifFalse ? pipe(ifFalse) : identity
  }
}
