import { RootCommandOptions, rootCommand } from './root'
import { configCommand } from './config'
import { runCommand } from './run'
import { commands } from './commands'

export const defaultCommands = (opts?: RootCommandOptions) => commands(
    rootCommand(opts),
    configCommand(),
    runCommand(),
)
