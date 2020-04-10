import { OperatorFunction, Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { LoggerFactory, Logger, getLogger } from '../utils/logging'

export { Logger, LoggerFactory } from '../utils/logging'

export function log<T>(
    factory: LoggerFactory | undefined,
    log: string | ((logger: Logger, x: T) => any),
    name?: string,
): OperatorFunction<T, T> {
    const logger = getLogger(name || 'default', factory)

    return (stream: Observable<T>) => stream.pipe(
        tap(x => typeof log === 'string' ? logger.info(log as string) : log(logger, x)),
    )
}
