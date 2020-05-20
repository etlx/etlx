import { Observable, empty, SchedulerLike, pipe } from 'rxjs'
import { expand } from 'rxjs/operators'

export function expandWhile<T = any>(
    predicate: (x: T) => boolean,
    project: (x: T) => Observable<T>,
    concurrent?: number,
    scheduler?: SchedulerLike,
) {
    return pipe(
        expand<T>(
            newx => predicate(newx) ? project(newx) : empty(),
            concurrent,
            scheduler,
        ),
    )
}