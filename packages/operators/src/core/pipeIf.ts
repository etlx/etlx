import { OperatorFunction, Observable } from 'rxjs'

type Condition = (() => boolean) | boolean  | undefined
type Op<A, B> = OperatorFunction<A, B>

export function pipeIf<A>(condition: Condition, ifTrue: Op<A, A>): Op<A, A>
export function pipeIf<A>(condition: Condition, ifTrue: Op<A, A>, ifFalse: Op<A, A>): Op<A, A>
export function pipeIf<A, B>(condition: Condition, ifTrue: Op<A, B>, ifFalse: Op<A, B>): Op<A, B>
export function pipeIf<A, B, C>(condition: Condition, ifTrue: Op<A, B>, ifFalse: Op<A, C>): Op<A, B | C>

export function pipeIf(condition: Condition, ifTrue: Op<any, any>, ifFalse?: Op<any, any>) {
    return (stream: Observable<any>) => {
        if (truthy(condition)) {
            return stream.pipe(ifTrue)
        } else {
            return ifFalse === undefined ? stream : stream.pipe(ifFalse)
        }
    }
}

function truthy(x: any): boolean {
    if (typeof x === 'function') {
        return truthy(x())
    } else if (x) {
        return true
    } else {
        return false
    }
}