import { EtlxCliCommand, EtlxCliCommandContext } from './types'

export const commands = (...cmd: EtlxCliCommand[]) => <T extends EtlxCliCommandContext>(opts: T): T => ({
  ...opts,
  commands: [...opts.commands, ...cmd],
})
