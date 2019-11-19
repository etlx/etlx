export * from './http'
export * from './logging'
export * from './array'

export const assertNever = (_: never) => {}

export function isNullOrUndefined<T>(value: T | null | undefined): value is null | undefined {
    return value === null || value === undefined
}

export function notNullOrUndefined<T>(value: T | null |undefined): value is T {
    return value !== undefined && value !== null
}