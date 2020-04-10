import commander from 'commander'
import { configCommand } from './commands/config'
import { cliInfo } from './commands/root'
import { runCommand } from './commands/run'
import { Configure, pipeConfigure } from './utils'
import { buildConfiguration } from './operators/configure/utils'
import { EtlxOptions } from './types'


export const etlx = (...configurations: Configure<EtlxOptions>[]) => {
    let init: EtlxOptions = {
        commands: [],
        configurations: [],
        observables: [],
    }

    let context = pipeConfigure(configurations)(init)
    let config = buildConfiguration(context.configurations)

    let commands = [
        cliInfo(),
        configCommand(config),
        runCommand(config.getProperties(), context.observables),
        ...context.commands,
    ]
    let cli = modify(new commander.Command(), commands)

    return etlxRunner(cli)
}

function etlxRunner(cli: commander.Command) {
    const NODE_MIN_ARGS = 2

    return (argv: string[] = process.argv) => {
        cli.parse(argv)

        if (argv.length <= NODE_MIN_ARGS) {
            cli.outputHelp()
            process.exitCode = 1
        }
    }
}

function modify<A>(init: A, fns: Array<(a: A) => A>) {
    return fns.reduce(
        (x, f) => {
            f(x)
            return x
        },
        init,
    )
}