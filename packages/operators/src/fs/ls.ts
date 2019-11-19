import { promises as fs, existsSync } from 'fs'
import path, { ParsedPath } from 'path'
import { OperatorFunction, from } from 'rxjs'
import { mergeMap, filter, map } from 'rxjs/operators'
import { isNullOrUndefined, notNullOrUndefined, flatten } from '../utils/array'
import * as minimatch from 'minimatch'
const empty: any[] = []


export type LsOptions = {
    recursive?: boolean,
    pattern?: string,
    filesOnly?: boolean,
    basedir?: string,
}

export type LsItem = ParsedPath & {
    path: string,
    type: string,
}

export function ls(options?: LsOptions): OperatorFunction<string | void, LsItem> {
    const opts = options || {}

    return stream => stream.pipe(
        map(x => x || opts.basedir),
        filter(x => notNullOrUndefined(x) && existsSync(x)),
        mergeMap(x => from(lsPromise(x!, opts))),
        mergeMap(x =>  from(x)),
    )
}

async function lsPromise(pathString: string, opts: LsOptions, terminal: boolean = false): Promise<LsItem[]> {
    const itemPath = path.resolve(pathString)
    const parsed = path.parse(itemPath)
    const matchPattern = isMatchPattern(itemPath, opts.pattern)

    const stats = await fs.lstat(itemPath)
    if (stats.isFile()) {
        return matchPattern ? [{ ...parsed, path: itemPath, type: 'file' }] : empty
    }

    const children = terminal ? [] : await getChildren(pathString, opts)

    if (opts.filesOnly || !matchPattern) {
        return children
    }

    const currentDirItem = { ...parsed, path: itemPath, type: 'directory' }
    return [currentDirItem, ...children]
}

async function getChildren(pathString: string, opts: LsOptions) {
    const files = await fs.readdir(pathString)
    const children = files.map(x => lsPromise(path.join(pathString, x), opts, opts.recursive !== true))
    return flatten(await Promise.all(children))
}

const matchOptions: minimatch.IOptions = {
    matchBase: true,
}

function isMatchPattern(pathstring: string, pattern?: string) {
    if (isNullOrUndefined(pattern) || pattern.length === 0) {
        return true
    }

    const filter = minimatch.filter(pattern, matchOptions)

    return filter(pathstring, 0, empty)
}
