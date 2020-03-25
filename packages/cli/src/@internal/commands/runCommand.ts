import { Pipes, isScriptsValid, createPipeline, runPipeline } from '../pipe'
import { LogLevel } from '../log/types'
import { notNullOrUndefined } from '../utils'
import { configureLogging, LogOptions } from '../log/configure'

export const runCommand = (
    cli: any,
    config: any,
    pipes: Pipes,
) => cli
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
            return
        }

        const logger = createLogger(cmd, config)
        const opts = { ...config, logger }

        const pipeline = createPipeline(pipes, scripts, cmd.concurrent || false)

        runPipeline(pipeline(opts))
        .then(() => {
            process.exit(0)
        })
        .catch((error) => {
            console.error('Error', error)
            process.exit(1)
        })
    })


function createLogger(cmd: { raw?: boolean, log?: LogLevel }, config: { log?: LogOptions }) {
    const logConfig = config.log || {}
    const opts = {
        ...logConfig,
        raw: cmd.raw || logConfig.raw,
        level: cmd.log || logConfig.level }

    return configureLogging(opts)
}

function getScriptsDescription(pipes: Pipes): string {
    const pad = ''.padStart(22)

    const namedScripts = pipes.map(x => x.name).filter(notNullOrUndefined)
    const availableScripts = namedScripts.length === 0 ? [] : [
        'Available scripts are:',
        ...namedScripts.map(x => `* ${x}`),
    ]

    const lines = [
        'Names of the scripts to run.',
        'If none specified, all scripts will run [--concurrent]ly (by default).',
        ...availableScripts,
    ]

    return lines.join(`\n${pad}`)
}
