import { configure } from './configure'
import { addYaml, addFiles, addSchema } from './operators'
import { Schema } from './types'

const identity = <T>(x: T) => x

export const defaultConfiguration = (...schemes: Schema[]) => configure(
  addYaml(),
  addFiles('config.json', 'config.yml', 'config.yaml'),
  addFiles('config.dev.json', 'config.dev.yml', 'config.dev.yaml'),
  schemes.length === 0 ? identity : addSchema(...schemes),
)
