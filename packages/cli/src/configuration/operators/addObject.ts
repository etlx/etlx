import { ConfigurationOptions } from '../types'

export const addObject = <T>(config: T) => (opts: ConfigurationOptions) => ({
  ...opts,
  objects: [...opts.objects, config],
})
