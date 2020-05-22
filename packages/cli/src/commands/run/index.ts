import commander from 'commander'
import { buildConfiguration } from '../../configuration/utils'
import { InternalOperator } from '../../observe'
import { EtlxOptions } from '../../types'
import { notNullOrUndefined } from '../../@internal/utils'
import { isScriptsValid, createPipeline } from './utils'


export const runCommand = () => (cli: commander.Command, ctx: EtlxOptions) => {
  let { configurations, observables } = ctx
  let config = buildConfiguration(configurations).getProperties()

  return cli
    .command('run [scripts...]')
    .description('Run specified scripts', { scripts: getScriptsDescription(ctx.observables) })
    .option('--concurrent', 'True if all scripts should run in concurrently.', true)
    .allowUnknownOption(true)
    .action((scripts: any, cmd: any) => {
      if (scripts.length > 0 && !isScriptsValid(observables, scripts)) {
        cmd.help()
        process.exit(1)
      }

      let pipeline = createPipeline(observables, scripts, cmd.concurrent || false)

      pipeline(config).subscribe({
        next: () => {},
        error: (e) => {
          // eslint-disable-next-line no-console
          console.error('Error', e)
          process.exit(1)
        },
        complete: () => {
          process.exit(0)
        },
      })
    })
}

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
