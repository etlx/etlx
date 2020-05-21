import { OperatorFunction, Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

import { LoggerConfig, Logger } from './types'
import { createLogger } from './createLogger'


export function log<T>(
    config: LoggerConfig,
    msg: string | ((l: Logger, x: T) => void),
    name?: string,
): OperatorFunction<T, T> {
    let logger = createLogger(config, name)

    let sideffect = typeof msg === 'function'
        ? (x: T) => msg(logger, x)
        : () => logger.info(msg)

    return ($: Observable<T>) => $.pipe(tap(sideffect))
}
