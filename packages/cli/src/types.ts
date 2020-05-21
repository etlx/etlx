import { ConfigurationContext } from './configuration/types'
import { EtlxCliCommandContext } from './commands/types'
import { EtlxOperatorContext } from './observe/types'

export type EtlxOptions =
    & EtlxCliCommandContext
    & ConfigurationContext
    & EtlxOperatorContext
