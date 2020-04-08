import { merge, concat, Observable } from 'rxjs'
import { notNullOrUndefined } from '../utils'

type FullPipe = (config: any) => ($: Observable<any>) => Observable<any>

export type EtlPipe =
    | Observable<any>
    | ((config: any) => Observable<any>)
    | FullPipe

export type NamedPipe = {
    name?: string,
    pipe: EtlPipe,
}

export type Pipes = Array<NamedPipe>

export const createPipeline = (
    pipes: Pipes,
    scripts: string[],
    concurrent: boolean,
): FullPipe => {
    let combine = concurrent ? merge : concat
    let filtered = scripts.length === 0
        ? pipes
        : scripts.map(name => pipes.find(x => x.name === name)).filter(notNullOrUndefined)

    return (config: any) => ($: Observable<any>) => combine(...filtered.map(({ pipe }) => {
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


export function isScriptsValid(pipes: Pipes, scripts: string[]) {
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
