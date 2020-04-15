import { isObservable } from '../utils/observable'
import { EtlxOptions } from '../builder/types'
import { EtlxOperatorVariant, EtlxOperator } from './types'


export const observe = (obs: EtlxOperatorVariant, name?: string) => (opts: EtlxOptions): EtlxOptions => {
    let observable = toOperator(obs)

    return ({
        ...opts,
        observables: [...opts.observables, { name, observable }],
    })
}

function toOperator(variant: EtlxOperatorVariant): EtlxOperator {
    if (isObservable(variant)) {
        return () => variant
    }

    if (typeof variant === 'function') {
        return variant
    }

    throw new TypeError('observe argument type is invalid. Expected (config -> observable) or (observable)')
}