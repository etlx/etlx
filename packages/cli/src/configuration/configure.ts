import { Configure } from '../../@internal/utils'
import { EtlxOptions } from '../builder'
import { ConfigurationOptions } from './types'

export const configure = (...xs: Configure<ConfigurationOptions>[]) => (opts: EtlxOptions): EtlxOptions => ({
    ...opts,
    configurations: [...opts.configurations, ...xs],
})
