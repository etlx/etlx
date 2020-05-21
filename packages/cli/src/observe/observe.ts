import { isObservable } from '../utils/observable'
import { EtlxOperatorVariant, EtlxOperator, EtlxOperatorContext } from './types'


// eslint-disable-next-line arrow-parens
export const observe = (obs: EtlxOperatorVariant, name?: string) => <T extends EtlxOperatorContext>(opts: T): T => {
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
