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
    const opts: ConfigBuildOptions = {
        paths: [],
        objects: [],
        schemes: [],
        suppressWarnings: false,
    }

    return {
        addSchema(...configSchemes: convict.Schema<any>[]) {
            opts.schemes.push(...configSchemes)
            return this
        },
        addFile(...paths: string[]) {
            opts.paths.push(...paths)
            return this
        },
        addObject(...configs: any[]) {
            opts.objects.push(...configs)
            return this
        },
        warnings(enabled: boolean) {
            opts.suppressWarnings = !enabled
            return this
        },
        build() {
            return buildConfig(opts)
        },
    }
}

function buildConfig(opts: ConfigBuildOptions): convict.Config<any> {
    const schema = Object.assign({}, ...opts.schemes)
    const config = convict(schema)

    config.loadFile(opts.paths)

    opts.objects.forEach(x => config.load(x))

    validateConfig(config, opts.suppressWarnings)

    return config
}