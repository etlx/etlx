import commander from 'commander'
import { configCommand } from './commands/config'
import { cliInfo } from './commands/root'
import { runCommand } from './commands/run'
import { Configure, pipeConfigure } from './utils'
import { buildConfiguration } from './operators/configure/utils'
import { EtlxOptions } from './types'
import { ConfigurationError } from './operators/configure/types'


export const etlx = (...configurations: Configure<EtlxOptions>[]) => {
    let init: EtlxOptions = {
        commands: [],
        configurations: [],
        observables: [],
    }

    let context = pipeConfigure(configurations)(init)

    let config = getConfig(context)

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
            if (typeof f === 'function') {
                f(x)
                return x
            } else {
                throw new TypeError('Unable to configure - all commands must be functions, but some were not')
            }
        },
        init,
    )
}

function getConfig(context: EtlxOptions) {
    try {
        return buildConfiguration(context.configurations)
    } catch (e) {
        if (e instanceof ConfigurationError) {
            console.error(e.toString())
            process.exit(1)
        } else {
            throw e
        }
    }
}