import { OperatorFunction, zip } from 'rxjs'
import { pipeFromArray } from 'rxjs/internal/util/pipe'

type O<A, B> = OperatorFunction<A, B>
type R<A, B> = OperatorFunction<A, [A, B]>

export function split<TIn>(): R<TIn, TIn>
export function split<TIn>(o1: O<TIn, TIn>): R<TIn, TIn>
export function split<TIn, TOut>(o1: O<TIn, TOut>): R<TIn, TOut>
export function split<TIn, A, TOut>(o1: O<TIn, A>, o2: O<A, TOut>): R<TIn, TOut>
export function split<TIn, A, B, TOut>(o1: O<TIn, A>, o2: O<A, B>, o3: O<B, TOut>): R<TIn, TOut>
export function split<TIn, A, B, C, TOut>(o1: O<TIn, A>, o2: O<A, B>, o3: O<B, C>, o4: O<C, TOut>): R<TIn, TOut>
export function split<TIn, A, B, C, D, TOut>(o1: O<TIn, A>, o2: O<A, B>, o3: O<B, C>, o4: O<C, D>, o5: O<D, TOut>): R<TIn, TOut>
export function split<TIn, A, B, C, D, E, TOut>(o1: O<TIn, A>, o2: O<A, B>, o3: O<B, C>, o4: O<C, D>, o5: O<D, E>, o6: O<E, TOut>): R<TIn, TOut>
export function split<TIn, A, B, C, D, E, F, TOut>(o1: O<TIn, A>, o2: O<A, B>, o3: O<B, C>, o4: O<C, D>, o5: O<D, E>, o6: O<E, F>, o7: O<F, TOut>): R<TIn, TOut>
export function split<TIn, A, B, C, D, E, F, G, TOut>(o1: O<TIn, A>, o2: O<A, B>, o3: O<B, C>, o4: O<C, D>, o5: O<D, E>, o6: O<E, F>, o7: O<F, G>, op8: O<G, TOut>): R<TIn, TOut>
export function split<TIn, A, B, C, D, E, F, G, H, TOut>(o1: O<TIn, A>, o2: O<A, B>, o3: O<B, C>, o4: O<C, D>, o5: O<D, E>, o6: O<E, F>, o7: O<F, G>, op8: O<G, H>, op9: O<H, TOut>): R<TIn, TOut>
export function split<TIn, TOut>(...operators: OperatorFunction<any, any>[]): R<TIn, TOut>

export function split(...operators: O<any, any>[]): O<any, any> {
  let f = pipeFromArray(operators)

  return $ => zip($, f($))
}
