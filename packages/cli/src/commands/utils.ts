import commander from 'commander'
import { EtlxCliCommandContext } from './types'


export function buildCommands(ctx: EtlxCliCommandContext) {
    return ctx.commands.reduce(
        (x, f) => {
            if (typeof f === 'function') {
                f(x, ctx)
                return x
            } else {
                throw new TypeError('Unable to configure - all commands must be functions, but some were not')
            }
        },
        new commander.Command(),
    )
}
