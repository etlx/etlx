import fs from 'fs'
import convict from 'convict'
import { flatten } from '../utils'

const throwIfEmpty = null

export function validateConfig(config: convict.Config<any>, suppresWarnings?: boolean) {
    config.validate({
        output: suppresWarnings ? () => {} : undefined,
    } as any)

    const missingProps = validateConfigValue(config.getProperties())
    if (missingProps.length > 0) {
        const errors = missingProps.map(x => `Config property '${x}' is required, but missing`).join('\n* ')

        throw new Error(`Config is invalid\n* ${errors}\n`)
    }
}

function validateConfigValue(obj: any, property?: string): string[] {
    if (obj === throwIfEmpty) {
        return property === undefined ? [] : [property]
    } else if (typeof obj === 'object') {
        const arrays = Object.entries(obj).map(([key, value]) => {
            const currentProp = property === undefined ? key : `${property}:${key}`
            return validateConfigValue(value, currentProp)
        })

        return flatten(arrays)
    } else {
        return []
    }
}

export function createSchema<T>(schema: convict.Schema<T>): convict.Schema<T> {
    return schema
}

export function loadConfigIfExists(config: convict.Config<any>, filepath: string) {
    if (fs.existsSync(filepath)) {
        config.loadFile(filepath)
    }
}