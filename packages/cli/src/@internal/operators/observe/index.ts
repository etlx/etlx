import { Observable } from 'rxjs'
import { EtlxOperator, EtlxOptions } from '../../types'


export type EtlxOperatorVariant =
    | Observable<any>
    | ((config: any) => Observable<any>)
    | EtlxOperator

export const observe = (obs: EtlxOperatorVariant, name?: string) => (opts: EtlxOptions): EtlxOptions => {
    let observable = toOperator(obs)

    return ({
        ...opts,
        observables: [...opts.observables, { name, observable }],
    })
}

function toOperator(variant: EtlxOperatorVariant): EtlxOperator {
    if (variant instanceof Observable) {
        return () => () => variant
    }

    if (typeof variant === 'function') {
        return (config) => {
            let result: any = variant(config)

            if (result instanceof Observable) {
                return () => result
            }

            if (typeof result === 'function') {
                return $ => result($)
            }

            throw new Error('ETL operator type is invalid. Expected (config -> observable -> observable), (config -> observable) or (observable)')
        }
    }

    throw new Error('ETL operator type is invalid. Expected (config -> observable -> observable), (config -> observable) or (observable)')
}