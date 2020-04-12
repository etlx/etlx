import commander from 'commander'
import { Observable } from 'rxjs'
import { Configure } from './utils'
import { SchemaObj } from 'convict'

export type EtlxOperator = (config: any) => ($: Observable<any>) => Observable<any>

export type InternalOperator = {
    name?: string,
    observable: EtlxOperator,
}

export type EtlxCliCommand = (cli: commander.Command, ctx: EtlxOptions) => commander.Command

export type EtlxOptions = {
    observables: InternalOperator[],
    configurations: Configure<ConfigurationOptions>[],
    commands: EtlxCliCommand[],
}


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