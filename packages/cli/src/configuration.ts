import { Schema } from './@internal/types'
import { configure } from './@internal/operators/configure'
import { addYaml, addFiles, addSchema } from './@internal/operators/configure/operators'
import { addLogging } from './@internal/log'

export * from './@internal/operators/configure/operators'
export * from './@internal/types'

const identity = <T>(x: T) => x

export const addDefaultConfiguration = (schema?: Schema) => configure(
    addYaml(),
    addFiles('config.json', 'config.yml', 'config.yaml'),
    schema ? addSchema(schema) : identity,
    addLogging({ level: 'info', raw: false }),
)