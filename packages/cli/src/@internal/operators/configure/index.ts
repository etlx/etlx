import { Configure } from '../../utils'
import { EtlxOptions } from '../../types'
import { ConfigurationOptions } from './types'

export const configure = (...xs: Configure<ConfigurationOptions>[]) => (opts: EtlxOptions): EtlxOptions => ({
    ...opts,
    configurations: [...opts.configurations, ...xs],
})