import { of } from 'rxjs'
import { tap } from 'rxjs/operators'

import { etlx, configure, observe, command } from '.'
import { REQUIRED, createSchema, addFile, addObject, addSchema } from './configuration'
import { addLogging, LoggerConfig } from './logging'
import { addDefaultCommands } from './command'

type Config = LoggerConfig & {
    port: number,
}

let s = createSchema<Config>({
    port: {
        default: REQUIRED,
        format: '*',
        arg: '',
        doc: 'Port Desc',
        env: '',
        sensitive: false,
    },
})

etlx(
    addDefaultCommands({ name: 'test', description: 'This is a test', version: '0.1.0' }),
    configure(
        addFile('config.json'),
        addObject({ foo: 'bar' }),
        addSchema(s),
        addLogging({ level: 'debug', raw: false }),
    ),
    observe((config: Config) => of(config).pipe(
        tap(console.log),
        tap(() => config.logger('TEST')),
    )),
)()