import { of } from 'rxjs'
import { tap } from 'rxjs/operators'

import { etlx } from '.'
import { REQUIRED, createSchema, configure, addObject, defaultConfiguration } from './configuration'
import { LoggerConfig } from './logging'
import { defaultCommands } from './commands'
import { observe } from './observe'
(require('./polyfills'))(global)


type Config = LoggerConfig & {
    port: number,
}

let schema = createSchema<Config>({
    port: {
        default: REQUIRED,
        format: '*',
        arg: '',
        env: '',
        sensitive: false,
    },
})

etlx(
    defaultCommands(),
    defaultConfiguration(schema),
    configure(
        addObject({ port: 8080 }),
    ),
    observe((config: Config) => of(config).pipe(
        tap(console.log),
        tap(() => config.logger('TEST')),
    )),
)()