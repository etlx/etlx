import { OperatorFunction, pipe, Observable } from 'rxjs'
import { pairwise, filter, map } from 'rxjs/operators'

export function filterPrev<T>(fn: (x: T, prev: T | undefined, idx: number) => boolean): OperatorFunction<T, T> {
  return pipe(
    pairwise(),
    beginWith<[T | undefined, T]>(([prev]) => [undefined, prev!]),
    filter(([prev, next], idx) => fn(next, prev, idx)),
    map(([, next]) => next),
  )
}

export function filterNext<T>(fn: (x: T, next: T | undefined, idx: number) => boolean): OperatorFunction<T, T> {
  return pipe(
    pairwise(),
    completeWith<[T, T | undefined]>(([, next]) => [next!, undefined]),
    filter(([prev, next], idx) => fn(prev, next, idx)),
    map(([prev]) => prev),
  )
}

function beginWith<T>(fn: (x: T) => T): OperatorFunction<T, T> {
  return $ => new Observable((sub) => {
    let idx = 0

    let next = (x: T) => {
      if (idx === 0) {
        sub.next(fn(x))
        idx++
      }
      sub.next(x)
    }

    let complete = sub.complete.bind(sub)
    let error = sub.error.bind(sub)

    return $.subscribe({ next, complete, error })
  })
}

function completeWith<T>(fn: (x: T) => T): OperatorFunction<T, T> {
  return $ => new Observable((sub) => {
    let prev: T

    let next = (x: T) => {
      sub.next(x)
      prev = x
    }

    let complete = () => {
      sub.next(fn(prev))
      sub.complete()
    }

    let error = sub.error.bind(sub)

    return $.subscribe({ next, error, complete })
  })
}