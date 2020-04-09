import fs from 'fs'
import { SchemaObj, Config } from 'convict'
import { flatten } from '../utils'

export const REQUIRED = null

export type Schema<T = any> = {
    [P in keyof T]?: Schema<T[P]> | SchemaObj<T[P]>
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

export function createSchema<T>(schema: Schema<T>): Schema<T> {
    return schema as any
}

export function loadConfigIfExists(config: Config<any>, filepath: string) {
    if (fs.existsSync(filepath)) {
        config.loadFile(filepath)
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