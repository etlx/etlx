import { LoggingOptions, Logger } from './types'



export function filterLogger(opts: LoggingOptions, logger: Logger): Logger {
    let getNameConfig = (name?: string) =>
        name && opts.components && name in opts.components
            ? opts.components[name]
            : {}

    return (message, level, name) => {
        let config = getNameConfig(name)
        let minLevel = config.level || opts.level || 'info'

        if (greaterOrEqual(level || 'info', minLevel)) {
            logger(message, level, name)
        }
    }
}


const Levels: any = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    silent: 4,
}

function greaterOrEqual(a: string, b: string) {
    let ai = Levels[a]
    let bi = Levels[b]

    return ai !== undefined && bi !== undefined && ai >= bi
}