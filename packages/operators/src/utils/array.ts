export function flatten<T>(source: T[][]): Array<T> {
    return new Array<T>().concat(...source)
}