import { promises as fs } from 'fs'
import path, { ParsedPath } from 'path'
import { OperatorFunction, from } from 'rxjs'
import { mergeMap, map } from 'rxjs/operators'

type ReadFileOptions = {
    encoding?: 'ascii' | 'utf8' | 'utf-8' | 'utf16le' | 'ucs2' | 'ucs-2' | 'base64' | 'latin1' | 'binary' | 'hex',
}

type ReadFileItem = {
    content: string,
}


export function readFile<T extends ParsedPath = ParsedPath>(
    options?: ReadFileOptions,
): OperatorFunction<string | T, T & ReadFileItem> {
    const opts = options || {}

    return stream => stream.pipe(
        map(async (input) => {
            const [filepath, parsed] = parseFormatPath(input)

            const content = await fs.readFile(filepath, opts.encoding || 'utf8')

            return { ...parsed, content } as T & ReadFileItem
        }),
        mergeMap(x => from(x)),
    )
}

function parseFormatPath(input: string | ParsedPath): [string, ParsedPath] {
    if (typeof input === 'string') {
        const abs = path.resolve(input)
        return [abs, path.parse(abs)]
    }

    const str = path.format(input)
    return [str, input]
}