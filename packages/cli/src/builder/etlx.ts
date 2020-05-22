import commander from 'commander'
import { Configure, pipeConfigure } from '../@internal/utils'

import { ConfigurationError } from '../configuration'
import { EtlxOptions } from '../types'

import { buildCommands } from '../commands/utils'

const NODE_MIN_ARGS = 2

export const etlx = (...opts: Configure<EtlxOptions>[]) => {
  let init: EtlxOptions = {
    commands: [],
    configurations: [],
    observables: [],
  }

  let context = pipeConfigure(opts)(init)

  let cli = catchConfigurationError(() => buildCommands(context))

  return etlxRunner(cli)
}

function etlxRunner(cli: commander.Command) {
  return (argv: string[] = process.argv) => {
    catchConfigurationError(() => cli.parse(argv))

    if (argv.length <= NODE_MIN_ARGS) {
      cli.outputHelp()
      process.exitCode = 1
    }
  }
}

// eslint-disable-next-line consistent-return
function catchConfigurationError<T>(f: () => T): T {
  try {
    return f()
  } catch (e) {
    if (e instanceof ConfigurationError) {
      // eslint-disable-next-line no-console
      console.error(e.toString())
      process.exit(1)
    } else {
      throw e
    }
  }
}
