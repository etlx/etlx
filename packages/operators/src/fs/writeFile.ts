import fs from 'fs'
import path from 'path'

import { OperatorFunction, bindNodeCallback } from 'rxjs'
import { mergeMap, mapTo } from 'rxjs/operators'

type FsWriteFile = (path: fs.PathLike | number, data: any, options: fs.WriteFileOptions, callback: (err: NodeJS.ErrnoException | null) => void) => void
const writeFile$ = bindNodeCallback(fs.writeFile as FsWriteFile)

export type WriteFileOptions<T> = {
    name: (x: T) => string,
    ext?: string,
    dir?: string,
    encoding?: string,
    value?: (x: T) => null | undefined | string | number | boolean,
}

export function writeFile<T = any>(opts: WriteFileOptions<T>): OperatorFunction<T, T> {
    let getValue = opts.value || (x => x)

    return $ => $.pipe(
        mergeMap((x) => {
            let content = getValue(x)
            let encoding = opts.encoding || 'utf8'
            let filepath = path.format({
                name: opts.name(x),
                ext: opts.ext,
                dir: opts.dir,
            })

            return writeFile$(filepath, content, encoding).pipe(mapTo(x))
        }),
    )
}


