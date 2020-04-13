import { Observable } from 'rxjs'

export type EtlxOperator = (config: any) => ($: Observable<any>) => Observable<any>

export type InternalOperator = {
    name?: string,
    observable: EtlxOperator,
}

export type EtlxOperatorVariant =
    | Observable<any>
    | ((config: any) => Observable<any>)
    | EtlxOperator