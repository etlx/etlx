import { FileParser, ConfigurationOptions } from '../types'

export const addParser = (parser: FileParser) => (opts: ConfigurationOptions) => ({
  ...opts,
  parsers: [...opts.parsers, parser],
})
