import { ConfigurationOptions } from '../types'

export const warnings = (enabled: boolean) => (opts: ConfigurationOptions) => ({
    ...opts,
    suppressWarnings: !enabled,
})
