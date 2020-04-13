import { SchemaObj } from 'convict'

export const REQUIRED: any = null

export type Schema<T = any> = {
    [P in keyof T]?: Schema<T[P]> | SchemaObj<T[P]>
}

export type FileParser = {
    extension: string | string[],
    parse: (s: string) => any,
}

export type ConfigurationOptions = {
    suppressWarnings: boolean,
    paths: string[],
    schemes: Schema<any>[],
    objects: any[],
    parsers: FileParser[],
    overrides: Array<(config: any) => any>,
}

export class ConfigurationError extends Error {
    constructor(e?: string | Error) {
        let msg =
            e === undefined ? undefined
            : e instanceof Error ? e.message
            : e.toString()

        super(msg)
    }

    toString() {
        return `Invalid configuration - ${this.message}`
    }
}