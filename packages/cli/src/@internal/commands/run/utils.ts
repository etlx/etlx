import { merge, concat, Observable } from 'rxjs'
import { notNullOrUndefined } from '../../utils'
import { InternalOperator, EtlxOperator } from '../../types'

export const createPipeline = (
    operators: InternalOperator[],
    keys: string[],
    concurrent: boolean,
): EtlxOperator => {
    let combine = concurrent ? merge : concat
    let filtered = keys.length === 0
        ? operators
        : keys.map(name => operators.find(x => x.name === name)).filter(notNullOrUndefined)

    return (config: any) => ($: Observable<any>) => combine(...filtered.map(({ observable: pipe }) => {
        if (pipe instanceof Observable) {
            return pipe
        }

        let result = pipe(config)
        if (result instanceof Observable) {
            return result
        }

        if (typeof result === 'function') {
            return result($)
        }

        throw new Error('ETL operator type is invalid. Expected of of (config -> observable -> observable), (config -> observable) or (observable)')
    }))
}


export function isScriptsValid(pipes: InternalOperator[], scripts: string[]) {
    let pipesKeys = pipes.map(x => x.name).filter(notNullOrUndefined)

    if (pipesKeys.length === 0) {
        console.error('Error: Unable to run ETL - there are no named scritps')
        return false
    }

    return scripts.reduce(
        (acc, script) => {
            if (pipesKeys.indexOf(script) === -1) {
                console.error(`Error: Unable to find script named '${script}'`)
                return false
            }
            return acc
        },
        true,
    )
}
