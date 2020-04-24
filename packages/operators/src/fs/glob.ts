import glob_, { IOptions } from 'glob'
import { bindNodeCallback, Observable } from 'rxjs'

export type GlobOptions = IOptions

type Glob = (pattern: string, opts?: GlobOptions) => Observable<string[]>
export const glob: Glob = bindNodeCallback(
    (p: string, o: IOptions, cb: (e: any, m: string[]) => void) => glob_(p, o, cb),
)