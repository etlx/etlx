import { configure } from '../configuration'
import { pinoLogger } from './pinoLogger'
import { fromInternal } from './utils'
import { loggingConfigSchema, LoggingOptions, LoggingConfig } from './types'

const defaultOptions: LoggingOptions = { level: 'info', raw: false }

const createLogger = (config: LoggingConfig) => {
  let opts = config.logging || defaultOptions
  let pino = pinoLogger(opts)
  let logger = fromInternal(opts, pino)

  return { logger }
}

export const addLogging = (opts?: LoggingOptions) => configure(
  ctx => ({
    objects: ctx.objects.concat({ logging: opts }),
    schemes: ctx.schemes.concat(loggingConfigSchema),
    overrides: ctx.overrides.concat(createLogger),
  }),
)
