import { SchemaObj } from 'convict'
import { Configure } from '../utils'

export const REQUIRED: any = null

export type Schema<T = any> = {
    [P in keyof T]?: Schema<T[P]> | SchemaObj<T[P]>
}

export type FileParser = {
    extension: string | string[],
    parse: (s: string) => any,
}

export type ConfigurationContext = {
    configurations: Configure<ConfigurationOptions>[]
}

export type ConfigurationOptions = {
    suppressWarnings: boolean,
    paths: string[],
    schemes: Schema<any>[],
    objects: any[],
    parsers: FileParser[],
    overrides: Array<(config: any) => any>,
}

const getMessage = (e?: string | Error) => {
    if (e === undefined) {
        return undefined
    } else {
        return e instanceof Error ? e.message : e.toString()
    }
}

export class ConfigurationError extends Error {
    constructor(e?: string | Error) {
        let msg = getMessage(e)

        super(msg)
    }

    toString() {
        return `Invalid configuration - ${this.message}`
    }
}
