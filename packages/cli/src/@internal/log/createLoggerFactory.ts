import { LoggerFactory, LogLevel } from './types'

type LogFn = (opts: {name: string, msg: string, level: LogLevel}) => void

export function createLoggerFactory(log: LogFn): LoggerFactory {
    return (name: string) => ({
        debug: msg => log({ name, msg, level: 'debug' }),
        info: msg => log({ name, msg, level: 'info' }),
        warn: msg => log({ name, msg, level: 'warn' }),
        error: msg => log({ name, msg: formatError(msg), level: 'error' }),
    })
}

function formatError(error: string | Error) {
    return error.toString()
}