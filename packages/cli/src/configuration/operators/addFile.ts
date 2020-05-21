import { ConfigurationOptions } from '../types'

export const addFiles = (...filepaths: string[]) => (opts: ConfigurationOptions) => ({
  ...opts,
  paths: [...opts.paths, ...filepaths],
})
