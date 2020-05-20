import globCallback, { IOptions } from 'glob'
import { bindNodeCallback, Observable, from } from 'rxjs'
import { mergeMap } from 'rxjs/operators'

type Glob = (p: string, opts?: IOptions) => Observable<string[]>
const globObservable: Glob = bindNodeCallback(globCallback)

export type GlobOptions = IOptions
export const glob = (pattern: string, opts?: GlobOptions): Observable<string> =>
    globObservable(pattern, opts).pipe(mergeMap(from))