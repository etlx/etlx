import fs from 'fs'
import { OperatorFunction, identity } from 'rxjs'
import { finalize } from 'rxjs/operators'
import { streamInto } from '../stream'

type CreateWriteStreamOptions = {
    flags?: string,
    encoding?: string,
    fd?: number,
    mode?: number,
    autoClose?: boolean,
    start?: number,
    highWaterMark?: number,
}

export type StreamIntoFileOptions<T> = CreateWriteStreamOptions & {
    value?: (x: T) => null | undefined | string | number | boolean,
    separator?: string,
}

const stringify = <T>(f: (x: T) => any) => (a: T) => {
    let b = f(a)

    return b === null || b === undefined ? '' : b.toString()
}

export function streamIntoFile<T = any>(filepath: string, options?: StreamIntoFileOptions<T>): OperatorFunction<T, T> {
    let opts = options || {}

    let separator = opts.separator || '\n'
    let map = opts.value || identity
    let value = (x: T) => `${stringify(map)(x)}${separator}`

    let stream = fs.createWriteStream(filepath, options)
    let close = stream.close.bind(stream)

    return $ => $.pipe(
        streamInto(stream, { value }),
        finalize(close),
    )
}
