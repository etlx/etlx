import { EtlxOptions } from '../builder'
import { EtlxCliCommand } from './types'

export const commands = (...cmd: EtlxCliCommand[]) => (opts: EtlxOptions): EtlxOptions => ({
    ...opts,
    commands: [...opts.commands, ...cmd],
})
