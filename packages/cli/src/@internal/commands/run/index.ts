import commander from 'commander'
import { of } from 'rxjs'

import { InternalOperator } from '../../types'
import { notNullOrUndefined } from '../../utils'

import { isScriptsValid, createPipeline } from './utils'


export const runCommand = (config: any, operators: InternalOperator[]) => (cli: commander.Command) => cli
    .command('run [scripts...]')
    .description('Run specified scripts', { scripts: getScriptsDescription(operators) })
    .option('--concurrent', 'True if all scripts should run in concurrently.', true)
    .allowUnknownOption(true)
    .action((scripts: any, cmd: any) => {
        if (scripts.length > 0 && !isScriptsValid(operators, scripts)) {
            cmd.help()
            process.exit(1)
        }

        let pipeline = createPipeline(operators, scripts, cmd.concurrent || false)

        of(cmd)
        .pipe(pipeline(config))
        .subscribe({
            next: () => {},
            error: (e) => {
                console.error('Error', e)
                process.exit(1)
            },
            complete: () => {
                process.exit(0)
            },
        })
    })

function getScriptsDescription(operators: Array<InternalOperator>): string {
    let namedScripts = operators.map(x => x.name).filter(notNullOrUndefined)
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
