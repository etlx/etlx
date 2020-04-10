export const assertNever = (_: never) => {}

export function isNullOrUndefined<T>(value: T | null | undefined): value is null | undefined {
    return value === null || value === undefined
}

export function notNullOrUndefined<T>(value: T | null |undefined): value is T {
    return value !== undefined && value !== null
}

export function flatten<T>(source: T[][]) {
    return new Array<T>().concat(...source)
}

export type Configure<T> = (x: T) => T
export function pipeConfigure<T>(fns: Array<Configure<T>>) {
    return (init: T) => fns.reduce(call, init)
}

function call<A, B>(x: A, f: (a: A) => B): B {
    if (typeof f === 'function') {
        return f(x)
    } else {
        throw new TypeError('Unable to configure - some configuration items are not callable')
    }
}