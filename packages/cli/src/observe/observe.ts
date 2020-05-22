import { isObservable } from '../utils/observable'
import { EtlxOperatorVariant, EtlxOperator, EtlxOperatorContext, InternalOperator } from './types'

const isOperator = (x: any): x is EtlxOperatorVariant =>
  isObservable(x) || typeof x === 'function'

const fromObject = (obj: { [name: string]: EtlxOperatorVariant }): InternalOperator[] =>
  Object.entries(obj).map(([k, v]) => ({ name: k, observable: toOperator(v) }))

const fromArray = (xs: EtlxOperatorVariant[]): InternalOperator[] =>
  xs.map(x => ({ observable: toOperator(x) }))

const fromVariant = (obs: EtlxOperatorVariant, name?: string): InternalOperator[] =>
  [{ name, observable: toOperator(obs) }]

const typeError = () => new TypeError(
  'observe argument type is invalid.\n'
  + 'Expected one of (Variant, name?), Variant[], { [name]: Variant },\n'
  + 'where Variant is (config => Observable) or Observable',
)

const discriminate = (obs: any, name?: string): InternalOperator[] => {
  if (Array.isArray(obs)) {
    return fromArray(obs)
  }

  if (isOperator(obs)) {
    return fromVariant(obs, name)
  }

  if (typeof obs === 'object') {
    return fromObject(obs)
  }

  throw typeError()
}

type Configure = <T extends EtlxOperatorContext>(opts: T) => T

export function observe(obj: { [name: string]: EtlxOperatorVariant }): Configure
export function observe(xs: EtlxOperatorVariant[]): Configure
export function observe(obs: EtlxOperatorVariant, name?: string): Configure
export function observe(obs: any, name?: string): Configure {
  let observables = discriminate(obs, name)

  return opts => ({
    ...opts,
    observables: [...opts.observables, ...observables],
  })
}


function toOperator(variant: EtlxOperatorVariant): EtlxOperator {
  if (isObservable(variant)) {
    return () => variant
  }

  if (typeof variant === 'function') {
    return variant
  }

  throw typeError()
}
