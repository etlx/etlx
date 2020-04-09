import convict from 'convict'
import commander from 'commander'
import { formatDocs, getDocs } from '../config/docs'
import { validateConfig, loadConfigIfExists } from '../config'

export const configCommand = (config: convict.Config<any>) => (cli: commander.Command) => cli
    .command('config <command>')
    .description('Manage configuration', { command: getCommandDescription() })
    .option('-c|--config [path]', 'Path to config file')
    .action((command: any, cmd: any) => {
        switch (command) {
            case 'doc':
                const docs = formatDocs(getDocs(config))
                console.log(docs)
                return
            case 'validate':
                loadConfigIfExists(config, cmd.config || 'config.json')
                try {
                    validateConfig(config)
                    console.log('Config is valid')
                } catch (e) {
                    console.error('Config is invalid:\n', e.message)
                }
                return
            case 'show':
                loadConfigIfExists(config, cmd.config || 'config.json')
                console.log(config.toString())
                return
            default:
                console.error('Invalid command')
                return
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