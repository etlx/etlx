import { isNullOrUndefined } from '../utils'
import { Logger, LoggerInternal, LogLevel, LoggerConfig } from './types'


const empty = () => {}
const emptyLogger: Logger = {
    info: empty,
    debug: empty,
    error: empty,
    warn: empty,
}

const logFunction = (logger: LoggerInternal, level: LogLevel, name?: string) =>
    (msg: string | Error) => logger(msg, level, name)

export const createLogger = (config: LoggerConfig, name?: string): Logger => {
    if (isNullOrUndefined(config.logger)) {
        return emptyLogger
    }

    let logger = config.logger

    let info = logFunction(logger, 'info', name)
    let warn = logFunction(logger, 'warn', name)
    let error = logFunction(logger, 'error', name)
    let debug = logFunction(logger, 'debug', name)

    return { info, error, debug, warn }
}