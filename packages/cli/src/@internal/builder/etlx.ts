import commander from 'commander'
import { Pipes, EtlPipe } from '../pipe'

import { configCommand } from '../commands/configCommand'
import { cliInfo } from '../commands/root'
import { runCommand } from '../commands/runCommand'
import { ConfigurationBuilder, createConfigBuilder } from './configuration'
import { isNullOrUndefined } from '../utils'


export type CliCommand = (cli: commander.Command) => commander.Command

type EtlxBuilderContext = {
    pipes: Pipes,
    configuration: ConfigurationBuilder,
    commands: CliCommand[],
}

export interface EtlxBuilder {
    pipe(pipe: EtlPipe, name?: string): EtlxBuilder,
    pipe(pipes: EtlPipe[]): EtlxBuilder,
    pipe(pipes: { [name: string]: EtlPipe }): EtlxBuilder,
    configure(cb: (x: ConfigurationBuilder) => ConfigurationBuilder): EtlxBuilder,
    command(...cmd: CliCommand[]): EtlxBuilder,
    build(): { run: (argv?: string[]) => void },
}

export function etlx(): EtlxBuilder {
    return etlxBuilder({
        pipes: [],
        configuration: createConfigBuilder(),
        commands: [],
    })
}

function etlxBuilder(context: EtlxBuilderContext): EtlxBuilder {
    return {
        configure: configure => etlxBuilder({
            ...context,
            configuration: configure(context.configuration),
        }),
        command: (...commands) => {
            commands.forEach((command) => {
                if (isNullOrUndefined(command) || typeof command !== 'function') {
                    throw new Error(`Unable to add command - function is expected, but got ${typeof command}`)
                }
            })
            return etlxBuilder({
                ...context,
                commands: [...context.commands, ...commands],
            })
        },
        pipe: (etl: EtlPipe | EtlPipe[] | { [name: string]: EtlPipe }, name?: string) => {
            if (Array.isArray(etl)) {
                return etlxBuilder({
                    ...context,
                    pipes: [
                        ...context.pipes,
                        ...etl.map(pipe => ({ pipe }))
                    ],
                })
            }
            if (typeof etl === 'function') {
                return etlxBuilder({
                    ...context,
                    pipes: [
                        ...context.pipes,
                        { name, pipe: etl },
                    ],
                })
            }
            if (typeof etl === 'object') {
                return etlxBuilder({
                    ...context,
                    pipes: [
                        ...context.pipes,
                        ...Object.entries(etl)
                            .filter(([_, pipe]) => typeof pipe === 'function')
                            .map(([name, pipe]) => ({ name, pipe })),
                    ],
                })
            }

            throw new Error(`Unexpected pipe type. [Array], [Object] or [Function] is expected, but got ${typeof etl}`)
        },
        build: () => {
            let config = context.configuration.build()

            let cli = pipeCommands(
                cliInfo(),
                configCommand(config),
                runCommand(config.getProperties(), context.pipes),
                ...context.commands,
            )

            return etlxRunner(cli(new commander.Command()))
        },
    }
}


const NODE_MIN_ARGS = 2
function etlxRunner(cli: commander.Command) {
    let run = (argv: string[] = process.argv) => {
        cli.parse(argv)

        if (argv.length <= NODE_MIN_ARGS) {
            cli.outputHelp()
            process.exitCode = 1
        }
    }

    return { run }
}

function pipeCommands(...fns: CliCommand[]): CliCommand {
    return (init: commander.Command) => fns.reduce(
        (cli, command) => {
            command(cli)
            return cli
        },
        init,
    )
}
