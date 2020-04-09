import { Schema, Configure, FileParser } from './types'


export function createSchema<T>(schema: Schema<T>): Schema<T> {
    return schema as any
}

export const addSchema = (schema: Schema): Configure => x => ({
    ...x,
    schemes: [...x.schemes, schema],
})

export const addFile = (filepath: string): Configure => opts => ({
    ...opts,
    paths: [...opts.paths, filepath],
})

export const addParser = (parser: FileParser): Configure => opts => ({
    ...opts,
    parsers: [...opts.parsers, parser],
})

export const addObject = (config: any): Configure => opts => ({
    ...opts,
    objects: [...opts.objects, config],
})

export const warnings = (enabled: boolean): Configure => opts => ({
    ...opts,
    suppressWarnings: !enabled,
})