import pino from 'pino'
import { assertNever } from '../utils'

import { LoggerOptions, Logger } from './types'
import { createLoggerFactory } from './utils'


const empty = () => {}
const nullLogger: Logger = {
    debug: empty,
    info: empty,
    warn: empty,
    error: empty,
}


export const createLogger = (opts: LoggerOptions) => {
    if (opts.level === 'silent') {
        return () => nullLogger
    }

    let pretty = opts.raw !== true
    let options: pino.LoggerOptions = {
        prettyPrint: pretty,
        timestamp: pretty ? false : undefined,
        base: null,
        level: opts.level || 'info',
    }

    let logger = pino(options)

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
