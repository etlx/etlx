import { Configure } from '../@internal/utils'
import { ConfigurationOptions, ConfigurationContext } from './types'

export const configure = (...xs: Configure<ConfigurationOptions>[]) => <T extends ConfigurationContext>(opts: T): T => ({
  ...opts,
  configurations: [...opts.configurations, ...xs],
})
