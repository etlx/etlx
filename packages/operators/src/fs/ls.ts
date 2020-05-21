import fs from 'fs'
import { join, parse, ParsedPath } from 'path'
import { of, empty, merge } from 'rxjs'
import { mergeMap, map, expand } from 'rxjs/operators'
import { lstat, readdir } from './bindings'

const toLsItem = (path: string) => (stats: fs.Stats): LsItem => ({
    ...parse(path),
    path,
    type: stats.isDirectory() ? 'directory' : 'file',
})

const scanDir = (dir: string) => readdir(dir).pipe(
    map(xs => xs.map(x => join(dir, x))),
    mergeMap(xs => merge(
        ...xs.map(x => lstat(x).pipe(map(toLsItem(x)))),
    )),
)

const scanDirRecursive = (dir: string) => scanDir(dir).pipe(
    expand(({ type, path }) => type === 'directory' ? scanDir(path) : empty()),
)

export type LsOptions = {
    recursive?: boolean,
}

export type LsItem = ParsedPath & {
    path: string,
    type: 'file' | 'directory',
}

export function ls(basePath: string, options?: LsOptions) {
    let opts = options || {}

    if (typeof basePath !== 'string') {
        throw new TypeError('basePath must be string')
    }

    return lstat(basePath).pipe(
        mergeMap((stats) => {
            if (stats.isFile()) {
                return of(toLsItem(basePath)(stats))
            } else {
                return opts.recursive ? scanDirRecursive(basePath) : scanDir(basePath)
            }
        }),
    )
}
