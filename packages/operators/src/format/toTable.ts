import { isNullOrUndefined } from 'util'
import { of, concat, identity, pipe, OperatorFunction } from 'rxjs'
import { take, map } from 'rxjs/operators'

import { choose, assert, combineVaradic } from '../core'
import { notNullOrUndefined, ofType, Type } from '../@internal/utils'

export type ToTableOptions<T = any> = {
  keys?: Array<keyof T>,
  headers?: { [K in keyof T]?: string },
  values?: (x: T, idx: number) => any[],
  stringify?: (x: any, idx: number) => any,
}

const firstObjectKeys = <T>() => pipe(take<T>(1), map(Object.keys))

const unexpectedTypeError = (name: string, expectedType: string) => (x: any) =>
  new Error(`Unexpected ${name} type. [${expectedType}] expected but [${typeof x}] received`)

function toHeaders<T>(opts: ToTableOptions<T>) {
  let getHeader = (key: string): string => {
    if (opts.headers) {
      let header: string | undefined = opts.headers[key as keyof T]
      return header || key
    } else {
      return key
    }
  }

  return pipe(
    choose<T, string[]>(
      opts.keys === undefined,
      firstObjectKeys(),
      () => of(opts.keys as string[]),
    ),
    map(xs => xs.filter(notNullOrUndefined).map(getHeader)),
  )
}

const keyOf = <T>(x: T) => (k: string | keyof T) => x[k as keyof T]
function mapValues<T>(opts: ToTableOptions<T>) {
  return (x: T, idx: number) => {
    let keys = opts.keys || Object.keys(x) as Array<keyof T>

    if (isNullOrUndefined(opts.values)) {
      return keys.map(keyOf(x))
    }

    let values = opts.values(x, idx)
    if (!Array.isArray(values)) {
      throw unexpectedTypeError("'values' option", 'Array')(values)
    }

    if (values.length !== keys.length) {
      throw new Error(`Invalid 'values' option return value. Expected ${keys.length} elements, received ${values.length}`)
    }

    return values
  }
}

function toRows<T>(opts: ToTableOptions<T>) {
  let stringify = opts.stringify || identity
  let toValues = mapValues(opts)
  let toStrings = (xs: any[]) => xs.map(stringify)

  return pipe(
    map(toValues),
    map(toStrings),
  )
}


export function toTable<T = any>(options?: ToTableOptions<T>): OperatorFunction<T, any[]> {
  let opts = options || {}
  validateOptions(opts)

  return pipe(
    assert<T>(ofType('object'), unexpectedTypeError('stream value', 'object')),
    choose(
      opts.headers === undefined,
      toRows(opts),
      combineVaradic<T, any[]>(concat, [
        toHeaders(opts),
        toRows(opts),
      ]),
    ),
  )
}


function validateOption<T>(x: T, key: keyof T, expectedType: Type) {
  let value = x[key]

  // eslint-disable-next-line valid-typeof
  if (notNullOrUndefined(value) && typeof value !== expectedType) {
    throw unexpectedTypeError(`'${key}' option`, expectedType)(value)
  }
}

function validateOptions(opts: ToTableOptions) {
  validateOption(opts, 'keys', 'object')
  validateOption(opts, 'headers', 'object')
  validateOption(opts, 'values', 'function')
  validateOption(opts, 'stringify', 'function')
}
