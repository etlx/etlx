import { Observable, OperatorFunction } from 'rxjs'
import { map } from 'rxjs/operators'

type ValidationErrors = {
    errors: string[],
}

export type ValidationStatus = { ok: boolean } & ValidationErrors

export type Validator<T> = (x: T) => ValidationStatus

export function combineValidators<T>(...validators: Validator<T>[]): Validator<T> {
    return (x: T) => validators.reduce(
        (acc, f) => {
            let { ok, errors } = f(x)

            return {
                ok: acc.ok && ok,
                errors: [...acc.errors, ...errors],
            }
        },
        ok(),
    )
}

export function validate<T>(validator: Validator<T>): OperatorFunction<T, [T, boolean, string[]]> {
    let toTriple = (x: T): [T, boolean, string[]] => {
        let { ok, errors } = validator(x)
        return [x, ok, errors]
    }

    return ($: Observable<T>) => $.pipe(map(toTriple))
}

export function empty<T>(): Validator<T> {
    return ok
}

export function ok(): ValidationStatus {
    return { ok: true, errors: [] }
}

export function error(...errors: string[]): ValidationStatus {
    return { errors, ok: false }
}