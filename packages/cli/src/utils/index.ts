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

export type Configure<T> = (x: T) => Partial<T>
const normalizeConfiguration = <T extends Object>(f: Configure<T>) => (x: T): T => ({ ...x, ...f(x) })
export function pipeConfigure<T extends Object>(fns: Array<Configure<T>>) {
    let configs = fns.map(normalizeConfiguration)
    return (init: T) => configs.reduce(call, init)
}

function call<A, B>(x: A, f: (a: A) => B): B {
    if (typeof f === 'function') {
        return f(x)
    } else {
        throw new TypeError('Unable to configure - some configuration items are not callable')
    }
}