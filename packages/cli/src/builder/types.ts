import { ConfigurationOptions } from '../configuration'
import { EtlxCliCommand } from '../commands'
import { InternalOperator } from '../observe'
import { Configure } from '../utils'

export type EtlxOptions = {
    observables: InternalOperator[],
    configurations: Configure<ConfigurationOptions>[]
    commands: EtlxCliCommand[],
}
