import commander from 'commander'
import { EtlxOptions, ConfigurationError } from './types'
import { Configure, pipeConfigure } from './utils'
import { buildCommands } from './operators/command/utils'


export const etlx = (...configurations: Configure<EtlxOptions>[]) => {
    let init: EtlxOptions = {
        commands: [],
        configurations: [],
        observables: [],
    }

    let context = pipeConfigure(configurations)(init)

    let cli = catchConfigurationError(() => buildCommands(context))

    return etlxRunner(cli)
}

function etlxRunner(cli: commander.Command) {
    const NODE_MIN_ARGS = 2

    return (argv: string[] = process.argv) => {
        catchConfigurationError(() => cli.parse(argv))

        if (argv.length <= NODE_MIN_ARGS) {
            cli.outputHelp()
            process.exitCode = 1
        }
    }
}

function catchConfigurationError<T>(f: () => T): T {
    try {
        return f()
    } catch (e) {
        if (e instanceof ConfigurationError) {
            console.error(e.toString())
            process.exit(1)
        } else {
            throw e
        }
    }
}