import pino from 'pino'
import { LoggingOptions, LoggerInternal } from './types'


export const pinoLogger = (opts: LoggingOptions): LoggerInternal => {
    let pretty = opts.raw !== true
    let prettyOpts: pino.PrettyOptions = {
        translateTime: 'HH:mm:ss',
        ignore: 'pid,hostname',
    }
    let options: pino.LoggerOptions = {
        prettyPrint: pretty ? prettyOpts : false,
        level: opts.level || 'info',
        base: null,
    }

    return fromPino(pino(options))
}

function fromPino(pino: pino.Logger): LoggerInternal {
    return (msg, level, name) => {
        let logger = pino.child({ name })

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