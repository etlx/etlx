import { of, identity } from 'rxjs'
import { etlx } from './etlx'
import { command } from './operators/command'
import { configure } from './operators/configure'
import { observe } from './operators/observe'

describe('etlx', () => {
    it('configuration functions must not mutate builder', () => {

        expect(
            etlx() === etlx(configure(identity)) ||
            etlx() === etlx(observe(of(42))) ||
            etlx() === etlx(command(identity)),
        ).toBeFalsy()
    })
})
