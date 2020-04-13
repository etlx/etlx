import { ConfigurationOptions } from '../configuration'
import { EtlxCliCommand } from '../commands'
import { InternalOperator } from '../observe'

export type EtlxOptions = {
    observables: InternalOperator[],
    configurations: Array<(x: ConfigurationOptions) => ConfigurationOptions>,
    commands: EtlxCliCommand[],
}
