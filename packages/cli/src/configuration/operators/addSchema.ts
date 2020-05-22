import { Schema, ConfigurationOptions } from '../types'

export const addSchema = (...schemes: Schema[]) => (opts: ConfigurationOptions) => ({
  ...opts,
  schemes: [...opts.schemes, ...schemes],
})
