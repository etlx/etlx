import { Observable } from '../@internal/utils/observable'

export type EtlxOperator = (config: any) => Observable<any>

export type EtlxOperatorContext = {
  observables: InternalOperator[],
}

export type InternalOperator = {
  name?: string,
  observable: EtlxOperator,
}

export type EtlxOperatorVariant =
    | Observable<any>
    | EtlxOperator
