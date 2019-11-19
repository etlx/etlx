import pino from 'pino'
import { LogLevel } from './types'
import { createLoggerFactory } from './createLoggerFactory'
import { assertNever } from '../utils'
import { nullLoggerFactory } from './nullLogger'

export type LogOptions = {
    level?: LogLevel | 'silent',
    raw?: boolean,
}

export const configureLogging = (opts: LogOptions) => {
    if (opts.level === 'silent') {
        return nullLoggerFactory
    }

    const pretty = opts.raw !== true
    const options: pino.LoggerOptions = {
        prettyPrint: pretty,
        timestamp: pretty ? false : undefined,
        base: null,
        level: opts.level || 'info',
    }

    const logger = pino(options)

    return createLoggerFactory(({ name, msg, level }) => {
        switch (level) {
            case 'debug':
                logger.debug(msg)
                break
            case 'info':
                logger.info(msg)
                break
            case 'warn':
                logger.warn(msg)
                break
            case 'error':
                logger.error(msg)
                break
            default:
                assertNever(level)
                break
        }
    })
}


export const logConfigSchema = {
    log: {
        level: {
            doc: 'Minimum level of log message to be printed. Possible values are: debug, info, warn, error, silent',
            default: 'info',
            env: 'LOG_LEVEL',
            format: '*',
        },
        raw: {
            doc: 'If set, logs are printed in Pino format suitable for further processing',
            default: 'false',
            env: 'LOG_RAW',
            format: '*',
        },
    },
}