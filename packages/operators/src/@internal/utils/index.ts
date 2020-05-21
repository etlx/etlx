export * from './promisify'
export * from './array'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const assertNever = (_: never) => {}

export function isNullOrUndefined<T>(value: T | null | undefined): value is null | undefined {
    return value === null || value === undefined
}

export function notNullOrUndefined<T>(value: T | null |undefined): value is T {
    return value !== undefined && value !== null
}

// eslint-disable-next-line @typescript-eslint/no-throw-literal
export const throwError = (e: string | Error) => { throw e }

export const not = <T>(predicate: (x: T) => boolean) => (x: T) => !predicate(x)

export type Type = 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function'

// eslint-disable-next-line valid-typeof
export const ofType = <T = any>(type: Type) => (x: T): x is T => typeof x === type
