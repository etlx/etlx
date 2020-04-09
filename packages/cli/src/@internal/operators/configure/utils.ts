import fs from 'fs'
import convict, { Config } from 'convict'
import { ConfigurationOptions, REQUIRED } from './types'
import { flatten, pipeConfigure, Configure } from '../../utils'

export function loadConfigIfExists(config: Config<any>, filepath: string) {
    if (fs.existsSync(filepath)) {
        config.loadFile(filepath)
    }
}

export function buildConfiguration(fns: Configure<ConfigurationOptions>[]): convict.Config<any> {
    let init: ConfigurationOptions = {
        paths: [],
        objects: [],
        schemes: [],
        suppressWarnings: true,
        parsers: [],
    }

    let opts = pipeConfigure(fns)(init)
    let schema = Object.assign({}, ...opts.schemes)
    let config = convict(schema)

    convict.addParser(opts.parsers)

    opts.paths.forEach(filepath => loadConfigIfExists(config, filepath))
    opts.objects.forEach(x => config.load(x))

    validateConfig(config, opts.suppressWarnings)

    return config
}

export function validateConfig(config: Config<any>, suppresWarnings?: boolean) {
    config.validate({
        output: suppresWarnings ? () => {} : undefined,
    } as any)

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