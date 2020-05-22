import { of } from 'rxjs'
import { observe } from './observe'
import { EtlxOperatorContext } from './types'
import '../@internal/testing/matchers'

const ctx: EtlxOperatorContext = { observables: [] }

describe('observe', () => {
  it('single (observable)', () => {
    let actual = observe(of(42))(ctx)

    let expected: EtlxOperatorContext = {
      observables: [{
        observable: () => of(42),
      }],
    }

    expect(actual).equals(expected, [pureFnsComparer])
  })

  it('single (config -> observable)', () => {
    let actual = observe(config => of(config))(ctx)

    let expected: EtlxOperatorContext = {
      observables: [{
        observable: (config: any) => of(config),
      }],
    }

    expect(actual).equals(expected, [pureFnsComparer])
  })

  it('single named', () => {
    let actual = observe(of(42), 'test')(ctx)

    let expected: EtlxOperatorContext = {
      observables: [{
        name: 'test',
        observable: () => of(42),
      }],
    }

    expect(actual).equals(expected, [pureFnsComparer])
  })

  it('object', () => {
    let actual = observe({ test: of(42) })(ctx)

    let expected: EtlxOperatorContext = {
      observables: [{
        name: 'test',
        observable: () => of(42),
      }],
    }

    expect(actual).equals(expected, [pureFnsComparer])
  })

  it('array', () => {
    let actual = observe([of(42), of(42)])(ctx)

    let expected: EtlxOperatorContext = {
      observables: [{
        observable: () => of(42),
      }, {
        observable: () => of(42),
      }],
    }

    expect(actual).equals(expected, [pureFnsComparer])
  })

  it('preserve original context', () => {
    let context = {
      observables: [{
        observable: () => of(42),
      }],
      test: '42',
    }

    let actual = observe(of(42))(context)

    let expected = {
      observables: [{
        observable: () => of(42),
      }, {
        observable: () => of(42),
      }],
      test: '42',
    }

    expect(actual).equals(expected, [pureFnsComparer])
  })

  it('throw on invalid type', () => {
    let actual = () => observe(42 as any)

    expect(actual).toThrowError()
  })
})


type ReturnValue = { ok: boolean, value?: any }

const equalReturn = (a: ReturnValue, b: ReturnValue) =>
  a.ok === b.ok && typeof a.value === typeof b.value

const returnValue = (f: Function): ReturnValue => {
  try {
    return { value: f(), ok: true }
  } catch {
    return { ok: false }
  }
}

function pureFnsComparer(a: any, b: any) {
  if (typeof a === 'function' && typeof b === 'function') {
    return a.length === b.length && equalReturn(returnValue(a), returnValue(b))
  }
  return undefined
}
