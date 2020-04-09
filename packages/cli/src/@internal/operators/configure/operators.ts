import { Schema, FileParser, ConfigurationOptions } from './types'


export function createSchema<T>(schema: Schema<T>): Schema<T> {
    return schema as any
}

export const addSchema = (schema: Schema) => (opts: ConfigurationOptions) => ({
    ...opts,
    schemes: [...opts.schemes, schema],
})

export const addFile = (filepath: string) => (opts: ConfigurationOptions) => ({
    ...opts,
    paths: [...opts.paths, filepath],
})

export const addParser = (parser: FileParser) => (opts: ConfigurationOptions) => ({
    ...opts,
    parsers: [...opts.parsers, parser],
})

export const addObject = (config: any) => (opts: ConfigurationOptions) => ({
    ...opts,
    objects: [...opts.objects, config],
})

export const warnings = (enabled: boolean) => (opts: ConfigurationOptions) => ({
    ...opts,
    suppressWarnings: !enabled,
})