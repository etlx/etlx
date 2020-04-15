import { LoggingOptions, LoggerInternal, Logger } from './types'

export const fromInternal = (opts: LoggingOptions, logger: LoggerInternal): Logger => {
    if (opts.level === 'silent') {
        return () => {}
    }

    let canLog = logFilter(opts)

    return (msg, level, name) => {
        let normalLevel = level || 'info'
        let normalName = name || 'app'

        if (canLog(msg, normalLevel, normalName)) {
            logger(msg, normalLevel, normalName)
        }
    }
}

function logFilter(opts: LoggingOptions) {
    let getNameConfig = (name?: string) =>
        name && opts.components && name in opts.components
            ? opts.components[name]
            : {}

    return (msg: string, level: string, name: string) => {
        let config = getNameConfig(name)
        let minLevel = config.level || opts.level || 'info'

        return notEmpty(msg) && greaterOrEqual(level, minLevel)
    }
}



const levels: any = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    silent: 4,
}

function greaterOrEqual(a: string, b: string) {
    let ai = levels[a]
    let bi = levels[b]

    return ai !== undefined && bi !== undefined && ai >= bi
}

function notEmpty(x: string | null | undefined): x is string {
    return x !== null && x !== undefined && x.length > 0
}