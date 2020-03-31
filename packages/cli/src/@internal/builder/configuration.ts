import convict from 'convict'
import { validateConfig } from '../config'

type ConfigBuildOptions = {
    suppressWarnings: boolean,
    paths: string[],
    schemes: convict.Schema<any>[],
    objects: any[],
}

export interface ConfigurationBuilder {
    warnings(enabled: boolean): ConfigurationBuilder,
    addSchema(...configSchemes: convict.Schema<any>[]): ConfigurationBuilder,
    addObject(...configs: { [key: string]: any }[]): ConfigurationBuilder,
    addFile(...paths: string[]): ConfigurationBuilder,
    build(): convict.Config<any>,
}

export function createConfigBuilder(): ConfigurationBuilder {
    return configBuilder({
        paths: [],
        objects: [],
        schemes: [],
        suppressWarnings: true,
    })
}

function configBuilder(opts: ConfigBuildOptions): ConfigurationBuilder {
    return {
        addSchema: (...configSchemes: convict.Schema<any>[]) => configBuilder({
            ...opts,
            schemes: [...opts.schemes, ...configSchemes],
        }),
        addFile: (...paths: string[]) => configBuilder({
            ...opts,
            paths: [...opts.paths, ...paths],
        }),
        addObject: (...configs: any[]) => configBuilder({
            ...opts,
            objects: [...opts.objects, ...configs],
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

    config.loadFile(opts.paths)

    opts.objects.forEach(x => config.load(x))

    validateConfig(config, opts.suppressWarnings)

    return config
}