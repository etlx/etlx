/* eslint-disable no-console */
import { merge, concat } from '../../@internal/utils/observable'
import { notNullOrUndefined } from '../../@internal/utils'
import { InternalOperator, EtlxOperator } from '../../observe'

export const createPipeline = (
  operators: InternalOperator[],
  keys: string[],
  concurrent: boolean,
): EtlxOperator => {
  let combine = concurrent ? merge : concat
  let filtered = keys.length === 0
    ? operators
    : keys.map(name => operators.find(x => x.name === name)).filter(notNullOrUndefined)

  let observables = (config: any) => filtered.map(({ observable }) => observable(config))

  return (config: any) => combine(...observables(config))
}


export function isScriptsValid(pipes: InternalOperator[], scripts: string[]) {
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
