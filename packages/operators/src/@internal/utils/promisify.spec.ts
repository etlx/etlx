import { Observable, from } from 'rxjs'
import { map, mergeMap } from 'rxjs/operators'
import { promisify, promisifyLast } from './promisify'

describe('promisify', () => {
  it('operator with 0 options', () => {
    let inc$ = () => ($: Observable<number>) => $.pipe(map(x => x + 1))

    let inc = promisify(inc$)

    let actual = inc(2)
    let expected = Promise.resolve([3])

    expect(actual).toEqual(expected)
  })

  it('operator with 1 options', () => {
    let add$ = (a: number) => ($: Observable<number>) => $.pipe(map(b => a + b))

    let add = promisify(add$)

    let actual = add(1, 2)
    let expected = Promise.resolve([3])

    expect(actual).toEqual(expected)
  })

  it('operator with 2 options', () => {
    let add$ = (a: number, b: number) => ($: Observable<number>) => $.pipe(map(c => a + b + c))

    let add = promisify(add$)

    let actual = add(1, 2, 3)
    let expected = Promise.resolve([6])

    expect(actual).toEqual(expected)
  })

  it('arguments in correct order', () => {
    let sub$ = (a: number) => ($: Observable<number>) => $.pipe(map(b => a + b))

    let sub = promisify(sub$)

    let actual = sub(3, 1)
    let expected = Promise.resolve([2])

    expect(actual).toEqual(expected)
  })

  it('resolve all items', () => {
    let repeat$ = (times: number) => ($: Observable<number>) =>
      $.pipe(mergeMap(x => from(new Array<number>(times).fill(x))))

    let repeat = promisify(repeat$)

    let actual = repeat(42, 3)
    let expected = Promise.resolve([42, 42, 42])

    expect(actual).toEqual(expected)
  })
})

describe('promisifyLast', () => {
  it('operator with 0 options', () => {
    let inc$ = () => ($: Observable<number>) => $.pipe(map(x => x + 1))

    let inc = promisifyLast(inc$)

    let actual = inc(2)
    let expected = Promise.resolve(3)

    expect(actual).toEqual(expected)
  })

  it('operator with 1 options', () => {
    let add$ = (a: number) => ($: Observable<number>) => $.pipe(map(b => a + b))

    let add = promisify(add$)

    let actual = add(1, 2)
    let expected = Promise.resolve(3)

    expect(actual).toEqual(expected)
  })

  it('operator with 2 options', () => {
    let add$ = (a: number, b: number) => ($: Observable<number>) => $.pipe(map(c => a + b + c))

    let add = promisify(add$)

    let actual = add(1, 2, 3)
    let expected = Promise.resolve(6)

    expect(actual).toEqual(expected)
  })

  it('arguments in correct order', () => {
    let sub$ = (a: number) => ($: Observable<number>) => $.pipe(map(b => a + b))

    let sub = promisify(sub$)

    let actual = sub(3, 1)
    let expected = Promise.resolve(2)

    expect(actual).toEqual(expected)
  })

  it('resolve last item only', () => {
    let repeat$ = (times: number) => ($: Observable<number>) =>
      $.pipe(mergeMap(x => from(new Array<number>(times).fill(x))))

    let repeat = promisify(repeat$)

    let actual = repeat(42, 3)
    let expected = Promise.resolve(42)

    expect(actual).toEqual(expected)
  })
})
