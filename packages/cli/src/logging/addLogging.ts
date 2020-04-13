import { createLogger as createLogger } from './logger'
import { loggerConfigSchema, LoggerOptions, LoggerConfig } from './types'
import { configure } from '../configuration'

export const addLogging = (logger: LoggerOptions) => configure(
    ctx => ({
        ...ctx,
        objects: ctx.objects.concat({ logger }),
        schemes: ctx.schemes.concat(loggerConfigSchema),
        overrides: ctx.overrides.concat((config: LoggerConfig) => ({
            logger: createLogger(config.logging || {}),
        })),
    }),
)