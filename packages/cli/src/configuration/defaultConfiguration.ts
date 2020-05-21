import { configure } from './configure'
import { addYaml, addFiles, addSchema } from './operators'
import { Schema } from './types'

const identity = <T>(x: T) => x

export const defaultConfiguration = (schema?: Schema) => configure(
  addYaml(),
  addFiles('config.json', 'config.yml', 'config.yaml'),
  schema ? addSchema(schema) : identity,
)
