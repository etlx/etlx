import { OperatorFunction, of, merge, concat, Observable } from 'rxjs'
import { notNullOrUndefined } from '../utils'

export type EtlPipe = (config: any) => OperatorFunction<any, any>

export type Pipes = Array<{
    name?: string,
    pipe: EtlPipe,
}>

export function createPipeline(
    pipes: Pipes,
    scripts: string[],
    concurrent: boolean,
): EtlPipe {
    const filtered = scripts.length === 0
        ? pipes
        : scripts.map(name => pipes.find(x => x.name === name)).filter(notNullOrUndefined)

    const combine = concurrent ? merge : concat

    return (config: any) =>
        (stream: Observable<void>) =>
            combine(...filtered.map(etl => etl.pipe(config)(stream)))
}

export function isScriptsValid(pipes: Pipes, scripts: string[]) {
    const pipesKeys = pipes.map(x => x.name).filter(notNullOrUndefined)

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
