import { etlx, EtlPipe } from '@etlx/cli'
import { every } from '@etlx/operators'
import { timer } from 'rxjs'
import * as rx from 'rxjs/operators'

const cancel = timer(5e3)

const pipe: EtlPipe = config => stream => stream.pipe(
    every(config.interval),
    rx.tap(x => console.log(x)),
    rx.takeUntil(cancel),
)

etlx()
.pipe([pipe])
.configure(config => config
    .addObject({ interval: '1s' })
    .warnings(false),
)
.build()
.run()
