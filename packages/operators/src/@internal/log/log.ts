import { OperatorFunction, Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

import { LoggerConfig, Logger } from './types'
import { createLogger } from './createLogger'


export function log<T>(
    config: LoggerConfig,
    log: string | ((l: Logger, x: T) => void),
    name?: string,
): OperatorFunction<T, T> {
    let logger = createLogger(config, name)

    let sideffect = typeof log === 'function'
        ? (x: T) => log(logger, x)
        : () => logger.info(log)

    return ($: Observable<T>) => $.pipe(tap(sideffect))
}
