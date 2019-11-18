type LogFunction = (msg: string) => void

export type Logger = {
    debug: LogFunction,
    info: LogFunction,
    warn: LogFunction,
    error: (msg: string | Error) => void,
}

export type LoggerFactory = (name: string) => Logger

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'