import { createLogger as createLogger } from './logger'
import { ConfigurationOptions } from '../types'
import { loggerConfigSchema, LoggerOptions, LoggerConfig } from './types'

export * from './types'

export const addLogging = (logger: LoggerOptions) => (ctx: ConfigurationOptions): ConfigurationOptions => ({
    ...ctx,
    objects: ctx.objects.concat({ logger }),
    schemes: ctx.schemes.concat(loggerConfigSchema),
    overrides: ctx.overrides.concat((config: LoggerConfig) => ({
        logger: createLogger(config.logging || {}),
    })),
})
