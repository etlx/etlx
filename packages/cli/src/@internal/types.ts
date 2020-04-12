import commander from 'commander'
import { Observable } from 'rxjs'
import { Configure } from './utils'
import { ConfigurationOptions } from './operators/configure/types'

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