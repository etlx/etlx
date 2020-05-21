/* eslint-disable no-console */
import commander from 'commander'
import { validateConfig, loadConfigIfExists, buildConfiguration } from '../../configuration/utils'
import { EtlxOptions } from '../../types'
import { formatDocs, getDocs } from './docs'

export const configCommand = () => (cli: commander.Command, ctx: EtlxOptions) => cli
    .command('config <command>')
    .description('Manage configuration', { command: getCommandDescription() })
    .option('-c|--config [path]', 'Path to config file')
    .action((command: any, cmd: any) => {
        let config = buildConfiguration(ctx.configurations)

        switch (command) {
            case 'doc': {
                let docs = formatDocs(getDocs(config))
                console.log(docs)
                return
            }
            case 'validate': {
                loadConfigIfExists(config, cmd.config || 'config.json')
                try {
                    validateConfig(config)
                    process.stdout.write('Config is valid')
                } catch (e) {
                    console.error('Config is invalid:\n', e.message)
                }
                return
            }
            case 'show': {
                loadConfigIfExists(config, cmd.config || 'config.json')
                console.log(config.toString())
                return
            }
            default: {
                console.error('Invalid command')
            }
        }
    })

function getCommandDescription() {
    let lines = [
        'One of the following:',
        '  * doc - show config documentation',
        '  * validate - make sure your configuration is valid',
        '  * show - show current configuration',
    ]

    return lines.join('\n')
}
