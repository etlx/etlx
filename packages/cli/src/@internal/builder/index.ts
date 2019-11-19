import commander from 'commander'
import { Pipes, EtlPipe } from '../pipe'

import { configCommand } from '../commands/configCommand'
import { cliInfo } from '../commands/root'
import { runCommand } from '../commands/runCommand'
import { ConfigurationBuilder, createConfigBuilder } from './configuration'


export interface EtlxBuilder {
    pipe(pipe: EtlPipe, name?: string): EtlxBuilder,
    pipe(pipes: EtlPipe[]): EtlxBuilder,
    pipe(pipes: { [name: string]: EtlPipe }): EtlxBuilder,
    configure(cb: (x: ConfigurationBuilder) => ConfigurationBuilder): EtlxBuilder,
    build(): { run: (argv: string[]) => void },
}

export function etlx(): EtlxBuilder {
    return etlxBuilder({
        pipes: [],
        configuration: createConfigBuilder(),
    })
}


type EtlxBuilderContext = {
    pipes: Pipes,
    configuration: ConfigurationBuilder,
}

function etlxBuilder(context: EtlxBuilderContext): EtlxBuilder {
    return {
        configure: configure => etlxBuilder({
            ...context,
            configuration: configure(context.configuration),
        }),
        pipe: (etl: EtlPipe | EtlPipe[] | { [name: string]: EtlPipe}, name?: string) => {
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
        build() {
            const config = context.configuration.build()

            const cli = new commander.Command()
            cliInfo(cli)
            configCommand(cli, config)
            runCommand(cli, config.getProperties(), context.pipes)


            const run = (argv: string[] = process.argv) => {
                cli.parse(argv)

                if (cli.args.length === 0) {
                    cli.help()
                }
            }

            return { run }
        },
    }
}