export type Logger = {
    debug: (msg: string) => void,
    info: (msg: string) => void,
    warn: (msg: string) => void,
    error: (msg: string | Error) => void,
}

export type LoggerFactory = (name: string) => Logger

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export type LoggerOptions = {
    level?: LogLevel | 'silent',
    raw?: boolean,
}

export type LoggerConfig = {
    logging?: LoggerOptions,
    logger: LoggerFactory,
}
export const loggerConfigSchema = {
    logging: {
        level: {
            doc: 'Minimum level of log message to be printed. Possible values are: debug, info, warn, error, silent',
            default: 'info',
            env: 'LOG_LEVEL',
            arg: 'log',
            format: '*',
        },
        raw: {
            doc: 'If set, logs are printed in Pino format suitable for machine processing',
            default: false,
            env: 'LOG_RAW',
            arg: 'log-raw',
            format: Boolean,
        },
    },
}