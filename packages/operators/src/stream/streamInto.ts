import stream from 'stream'
import { OperatorFunction, bindNodeCallback, pipe } from 'rxjs'
import { mapTo, concatMap } from 'rxjs/operators'


export type StreamIntoOptions<T> = {
  encoding?: string,
  value?: (x: T) => any,
}

export function streamInto<T = any>(writable: stream.Writable, options?: StreamIntoOptions<T>): OperatorFunction<T, T> {
  let opts = options || {}
  let encoding = opts.encoding || 'utf8'
  let value = opts.value || (x => x)
  let write$ = bindNodeCallback(writable.write.bind(writable))

  return pipe(
    concatMap(x => write$(value(x), encoding).pipe(mapTo(x))),
  )
}
