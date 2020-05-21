import fs from 'fs'
import readline from 'readline'
import { Observable } from 'rxjs'
import { finalize, map } from 'rxjs/operators'
import { fromAsyncIterable } from '../stream'

export type StreamFromFileOptions = {
  readline?: boolean,
  flags?: string,
  encoding?: string,
  fd?: number,
  mode?: number,
  autoClose?: boolean,
  start?: number,
  end?: number,
  highWaterMark?: number,
}

export function fromFileStream(filepath: string, options?: StreamFromFileOptions): Observable<string> {
  let opts = options || {}
  let input = fs.createReadStream(filepath, options)
  let close = input.close.bind(input)

  let iterable = opts.readline
    ? readline.createInterface({ input, crlfDelay: Infinity })
    : input

  return fromAsyncIterable<Buffer | string>(iterable).pipe(
    map(x => x.toString()),
    finalize(close),
  )
}
