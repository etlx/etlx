import { Observable } from '../utils/observable'

export type EtlxOperator = (config: any) => Observable<any>

export type InternalOperator = {
    name?: string,
    observable: EtlxOperator,
}

export type EtlxOperatorVariant =
    | Observable<any>
    | EtlxOperator