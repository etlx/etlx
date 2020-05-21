import commander from 'commander'

export type EtlxCliCommandContext = { commands: EtlxCliCommand[] }

export type EtlxCliCommand = (cli: commander.Command, ctx: EtlxCliCommandContext) => commander.Command
