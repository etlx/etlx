import commander from 'commander'
import { EtlxOptions } from '../builder'

export type EtlxCliCommand = (cli: commander.Command, ctx: EtlxOptions) => commander.Command