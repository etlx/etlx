import fs from 'fs'
import convict, { Config } from 'convict'
import { ConfigurationOptions, REQUIRED, ConfigurationError } from './types'
import { flatten, pipeConfigure, Configure } from '../utils'

export function loadConfigIfExists(config: Config<any>, filepath: string) {
    if (fs.existsSync(filepath)) {
        config.loadFile(filepath)
    }
}

export function buildConfiguration(fns: Configure<ConfigurationOptions>[]): convict.Config<any> {
    let init: ConfigurationOptions = {
        paths: [],
        objects: [],
        overrides: [],
        schemes: [],
        suppressWarnings: true,
        parsers: [],
    }

    let opts = pipeConfigure(fns)(init)

    convict.addParser(opts.parsers)

    let schema = Object.assign({}, ...opts.schemes)
    let config = convict(schema)

    opts.paths.forEach(filepath => loadConfigIfExists(config, filepath))
    opts.objects.forEach(x => config.load(x))
    opts.overrides.forEach(f => config.load(f(config.getProperties())))

    validateConfig(config, opts.suppressWarnings)
    return config
}

export function validateConfig(config: Config<any>, suppresWarnings?: boolean) {
    try {
        let output = suppresWarnings ? () => {} : undefined
        config.validate({ output } as any)
    } catch (e) {
        throw new ConfigurationError(e)
    }

    let missingProps = validateConfigValue(config.getProperties())
    if (missingProps.length > 0) {
        let errors = missingProps.map(x => `Config property '${x}' is required, but missing`).join('\n* ')

        throw new Error(`Config is invalid\n* ${errors}\n`)
    }
}

function validateConfigValue(obj: any, property?: string): string[] {
    if (obj === REQUIRED) {
        return property === undefined ? [] : [property]
    } else if (typeof obj === 'object') {
        let arrays = Object.entries(obj).map(([key, value]) => {
            let currentProp = property === undefined ? key : `${property}:${key}`
            return validateConfigValue(value, currentProp)
        })

        return flatten(arrays)
    } else {
        return []
    }
}
