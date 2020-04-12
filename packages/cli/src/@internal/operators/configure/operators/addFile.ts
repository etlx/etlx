import { ConfigurationOptions } from '../../../types'

export const addFile = (filepath: string) => (opts: ConfigurationOptions) => ({
    ...opts,
    paths: [...opts.paths, filepath],
})