import { Schema } from '../types'

export function createSchema<T>(schema: Schema<T>): Schema<T> {
    return schema as any
}
