import { Configure } from '../../utils'
import { EtlxOptions, ConfigurationOptions } from '../../types'

export const configure = (...xs: Configure<ConfigurationOptions>[]) => (opts: EtlxOptions): EtlxOptions => ({
    ...opts,
    configurations: [...opts.configurations, ...xs],
})