import { RootCommandOptions, rootCommand, configCommand, runCommand } from './@internal/operators/command/operators'
import { command } from './@internal/operators'

export * from './@internal/operators/command/operators'

export const addDefaultCommands = (opts?: RootCommandOptions) => command(
    rootCommand(opts),
    configCommand(),
    runCommand(),
)