import fs from 'fs'
import { lstat, rmdir, unlink } from './bindings'
import { mergeMap, mapTo, catchError } from 'rxjs/operators'
import { Observable, of } from 'rxjs'
import { choose } from '../core'


export type RmOptions = {
    recursive?: boolean,
    throw?: boolean,
}

export const rm = (path: fs.PathLike, opts?: RmOptions): Observable<fs.PathLike> =>
    lstat(path).pipe(
        mergeMap(x => x.isDirectory() ? rmdir(path, opts) : unlink(path)),
        mapTo(path),
        choose(!opts?.throw, catchError(() => of(path))),
    )