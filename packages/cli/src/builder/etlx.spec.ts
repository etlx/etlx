import { of, identity } from 'rxjs'
import { etlx } from './etlx'
import { commands } from '../commands'
import { configure } from '../configuration'
import { observe } from '../observe'

describe('etlx', () => {
    it('configuration functions must not mutate builder', () => {

        expect(
            etlx() === etlx(configure(identity)) ||
            etlx() === etlx(observe(of(42))) ||
            etlx() === etlx(commands(identity)),
        ).toBeFalsy()
    })
})
