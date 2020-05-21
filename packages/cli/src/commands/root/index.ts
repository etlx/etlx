import commander from 'commander'
import fs from 'fs'
import { dirname, join } from 'path'

const defaultOptions = {
  name: 'etlx',
  description: 'Rx-based ETL tool',
  version: '0.1.0',
}

export type RootCommandOptions = {
  name?: string,
  description?: string,
  version?: string,
}
export const rootCommand = (options?: RootCommandOptions) => {
  let opts: RootCommandOptions = {
    ...defaultOptions,
    ...packageJson(),
    ...options,
  }

  return (cli: commander.Command) => cli
    .name(opts.name || 'etlx')
    .description(opts.description || 'Rx-based ETL tool')
    .version(opts.version || '0.1.0')
    .on('command:*', () => {
      // eslint-disable-next-line no-console
      console.error(`Invalid command: ${cli.args.join(' ')}`)
      cli.outputHelp()
      process.exit(1)
    })
}


function packageJson<T = unknown>() : T | null {
  if (require?.main?.filename === undefined) {
    return null
  }

  let baseDir = dirname(require.main.filename)
  let filepath = searchFile(baseDir, 'package.json')

  return filepath === null ? null : parseJson(fs.readFileSync(filepath, 'utf-8'))
}

function searchFile(baseDir: string, filename: string): string | null {
  let filepath = join(baseDir, filename)
  let isExists = fs.existsSync(filepath)

  if (isExists) {
    return filepath
  }

  let parent = dirname(baseDir)
  if (parent === baseDir) {
    return null
  }

  return searchFile(parent, filename)
}

function parseJson(str: string) {
  try {
    return JSON.parse(str)
  } catch {
    return null
  }
}
