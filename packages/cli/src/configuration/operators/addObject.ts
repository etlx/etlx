import { ConfigurationOptions } from '../types'

export const addObject = (config: any) => (opts: ConfigurationOptions) => ({
    ...opts,
    objects: [...opts.objects, config],
})