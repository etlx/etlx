import { Observable, of, concat, identity } from 'rxjs'
import { take, map } from 'rxjs/operators'

import { choose, assert, combineVaradic } from '../core'
import { notNullOrUndefined, ofType, Type } from '../utils'
import { isNullOrUndefined } from 'util'

export type ToTableOptions<T = any> = {
    keys?: Array<keyof T>,
    headers?: { [K in keyof T]?: string },
    values?: (x: T, idx: number) => any[],
    stringify?: (x: any, idx: number) => any,
}

const firstObjectKeys = <T>() => ($: Observable<T>) => $.pipe(take(1), map(Object.keys))

const toHeaders = <T>(opts: ToTableOptions<T>) => {
    let getHeader = (key: string): string => {
        if (opts.headers) {
            let header: string | undefined = opts.headers[key as keyof T]
            return header || key
        } else {
            return key
        }
    }

    return ($: Observable<T>) => $.pipe(
        choose<T, string[]>(
            opts.keys === undefined,
            firstObjectKeys(),
            () => of(opts.keys as string[]),
        ),
        map(xs => xs.filter(notNullOrUndefined).map(getHeader)),
    )
}

const keyOf = <T>(x: T) => (k: string | keyof T) => x[k as keyof T]
const mapValues = <T>(opts: ToTableOptions<T>) => {
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

const toRows = <T>(opts: ToTableOptions<T>) => {
    let stringify = opts.stringify || identity
    let toValues = mapValues(opts)
    let toStrings = (xs: any[]) => xs.map(stringify)

    return ($: Observable<T>) => $.pipe(
        map(toValues),
        map(toStrings),
    )
}

const unexpectedTypeError = (name: string, expectedType: string) => (x: any) =>
    new Error(`Unexpected ${name} type. [${expectedType}] expected but [${typeof x}] received`)


export const toTable = <T = any>(options?: ToTableOptions<T>) => {
    let opts = options || {}
    validateOptions(opts)

    return ($: Observable<T>) => $.pipe(
        assert(ofType('object'), unexpectedTypeError('stream value', 'object')),
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


const validateOption = <T>(x: T, key: keyof T, expectedType: Type) => {
    let value = x[key]

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
