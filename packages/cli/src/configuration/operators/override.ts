import { ConfigurationOptions } from '../types'

export const override = <T>(f: (config: T) => T) => (opts: ConfigurationOptions): ConfigurationOptions => ({
  ...opts,
  overrides: [...opts.overrides, f],
})
