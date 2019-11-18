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
    build(): { run: () => void },
}

export function etlx(): EtlxBuilder {
    const pipes: Pipes = []
    const configBuilder = createConfigBuilder()

    return {
        configure(callback) {
            callback(configBuilder)
            return this
        },
        pipe(etl: EtlPipe | EtlPipe[] | { [name: string]: EtlPipe}, name?: string) {
            if (Array.isArray(etl)) {
                pipes.push(...etl.map(pipe => ({ pipe })))
                return this
            }
            if (typeof etl === 'function') {
                pipes.push({ name, pipe: etl })
                return this
            }
            if (typeof etl === 'object') {
                pipes.push(...Object.entries(etl)
                    .filter(([_, pipe]) => typeof pipe === 'function')
                    .map(([name, pipe]) => ({ name, pipe })),
                )
                return this
            }

            throw new Error(`Unexpected pipe type. [Array], [Object] or [Function] is expected, but got ${typeof etl}`)
        },
        build() {
            const config = configBuilder.build()

            const cli = new commander.Command()
            cliInfo(cli)
            configCommand(cli, config)
            runCommand(cli, config.getProperties(), pipes)


            const run = () => {
                cli.parse(process.argv)

                if (cli.args.length === 0) {
                    cli.help()
                }
            }

            return { run }
        },
    }
}
