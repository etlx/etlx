const emptyFn = () => {}
type LogFunction = (msg: string) => void

export type LoggerFactory = (name: string) => Logger

export type Logger = {
    debug: LogFunction,
    info: LogFunction,
    warn: LogFunction,
    error: (msg: string | Error) => void,
}

const nullLogger: Logger = {
    debug: emptyFn,
    info: emptyFn,
    warn: emptyFn,
    error: emptyFn,
}

export function getLogger(name: string, factory?: LoggerFactory) {
    return factory === undefined ? nullLogger : factory(name)
}