import pino from 'pino'
import { LoggerOptions, Logger } from './types'


const empty = () => {}

export const createLogger = (opts: LoggerOptions): Logger => {
    if (opts.level === 'silent') {
        return empty
    }

    let pretty = opts.raw !== true
    let options: pino.LoggerOptions = {
        prettyPrint: pretty,
        timestamp: pretty ? false : undefined,
        base: null,
        level: opts.level || 'info',
    }

    let logger = pino(options)

    return (message, level, name) => {
        if (message === null || message === undefined) {
            return
        }
        let msg = message.toString()

        switch (level) {
            case 'debug':
                logger.debug(msg)
                break
            case 'warn':
                logger.warn(msg)
                break
            case 'error':
                logger.error(msg)
                break
            default:
                logger.info(msg)
                break
        }
    }
}
