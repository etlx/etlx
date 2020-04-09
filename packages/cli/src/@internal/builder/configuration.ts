import convict from 'convict'
import { validateConfig, Schema } from '../config'
import fs from 'fs'

type FileParser = {
    extension: string | string[],
    parse: (s: string) => any,
}

type ConfigBuildOptions = {
    suppressWarnings: boolean,
    paths: string[],
    schemes: Schema<any>[],
    objects: any[],
    parsers: FileParser[],
}


export interface ConfigurationBuilder {
    addSchema<A = unknown>(schema: Schema<A>): ConfigurationBuilder,
    addObject(config: any): ConfigurationBuilder,
    addFile(filepath: string): ConfigurationBuilder,
    addParser(parser: FileParser): ConfigurationBuilder,
    warnings(enabled: boolean): ConfigurationBuilder,
    build(): convict.Config<any>,
}

export function createConfigBuilder(): ConfigurationBuilder {
    return configBuilder({
        paths: [],
        objects: [],
        schemes: [],
        suppressWarnings: true,
        parsers: [],
    })
}

function configBuilder(opts: ConfigBuildOptions): ConfigurationBuilder {
    return {
        addSchema: (schema: Schema) => configBuilder({
            ...opts,
            schemes: [...opts.schemes, schema],
        }),
        addFile: (filepath: string) => configBuilder({
            ...opts,
            paths: [...opts.paths, filepath],
        }),
        addParser: (parser: FileParser) => configBuilder({
            ...opts,
            parsers: [...opts.parsers, parser],
        }),
        addObject: (config: any) => configBuilder({
            ...opts,
            objects: [...opts.objects, config],
        }),
        warnings: (enabled: boolean) =>  configBuilder({
            ...opts,
            suppressWarnings: !enabled,
        }),
        build: () => buildConfig(opts),
    }
}

function buildConfig(opts: ConfigBuildOptions): convict.Config<any> {
    let schema = Object.assign({}, ...opts.schemes)
    let config = convict(schema)

    convict.addParser(opts.parsers)

    config.loadFile(opts.paths)

    opts.objects.forEach(x => config.load(x))

    validateConfig(config, opts.suppressWarnings)

    return config
}