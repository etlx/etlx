import { EtlxCliCommand, EtlxOptions } from '../types'

export const command = (cmd: EtlxCliCommand) => (opts: EtlxOptions): EtlxOptions => ({
    ...opts,
    commands: [...opts.commands, cmd],
})