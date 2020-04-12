import { Schema, ConfigurationOptions } from '../../../types'

export const addSchema = (schema: Schema) => (opts: ConfigurationOptions) => ({
    ...opts,
    schemes: [...opts.schemes, schema],
})