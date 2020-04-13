import { createLogger as createLogger } from './logger'
import { loggerConfigSchema, LoggerOptions, LoggerConfig } from './types'
import { configure } from '../configuration'

const defaultOptions: LoggerOptions = { level: 'info', raw: false }

export const addLogging = (opts?: LoggerOptions) => configure(
    ctx => ({
        ...ctx,
        objects: ctx.objects.concat({ logger: opts || defaultOptions }),
        schemes: ctx.schemes.concat(loggerConfigSchema),
        overrides: ctx.overrides.concat((config: LoggerConfig) => ({
            logger: createLogger(config.logging || {}),
        })),
    }),
)