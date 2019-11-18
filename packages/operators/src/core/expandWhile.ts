import { Observable, empty, SchedulerLike } from 'rxjs'
import { expand } from 'rxjs/operators'

export function expandWhile<T = any>(
    project: (x: T) => Observable<T>,
    predicate: (x: T) => boolean,
    concurrent?: number,
    scheduler?: SchedulerLike,
) {
    return (stream: Observable<T>) => stream.pipe(
        expand(
            newx => predicate(newx) ? project(newx) : empty(),
            concurrent,
            scheduler,
        ),
    )
}