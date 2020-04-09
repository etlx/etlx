import { Pipes, isScriptsValid, createPipeline } from '../pipe'
import { LogLevel } from '../log/types'
import { notNullOrUndefined } from '../utils'
import { configureLogging, LogOptions } from '../log/configure'
import { of } from 'rxjs'
import commander from 'commander'

export const runCommand = (config: any, pipes: Pipes) => (cli: commander.Command) => cli
    .command('run [scripts...]')
    .description('Run specified ETL script', { scripts: getScriptsDescription(pipes) })
    .option('--concurrent', 'True if all scripts should run in concurrently.', true)
    .option('-l|--log <level>', 'Minimum level of log message to be printed. Possible values are: debug, info, warn, error, silent')
    .option('--raw', 'If set, logs are printed in Pino format suitable for further processing')
    .allowUnknownOption(true)
    .action((scripts: any, cmd: any) => {
        if (scripts.length > 0 && !isScriptsValid(pipes, scripts)) {
            cmd.help()
            process.exit(1)
        }

        let logger = createLogger(cmd, config)
        let opts = { ...config, logger }

        let pipeline = createPipeline(pipes, scripts, cmd.concurrent || false)

        of(cmd)
        .pipe(pipeline(opts))
        .subscribe({
            next: () => {},
            error: (e) => {
                console.error('Error', e)
                process.exit(1)
            },
            complete: () => {
                console.log('Pipeline completed')
                process.exit(0)
            },
        })
    })


function createLogger(cmd: { raw?: boolean, log?: LogLevel }, config: { log?: LogOptions }) {
    let logConfig = config.log || {}
    let opts = {
        ...logConfig,
        raw: cmd.raw || logConfig.raw,
        level: cmd.log || logConfig.level }

    return configureLogging(opts)
}

function getScriptsDescription(pipes: Pipes): string {
    let namedScripts = pipes.map(x => x.name).filter(notNullOrUndefined)
    let availableScripts = namedScripts.length === 0
        ? []
        : ['Available scripts are:', ...namedScripts.map(x => `  * ${x}`)]

    let lines = [
        'Names of the scripts to run.',
        'If none specified, all scripts will run [--concurrent]ly (by default).',
        ...availableScripts,
    ]

    return lines.join('\n')
}
