import { WriteStream } from 'tty'
import commander from 'commander'
import { etlx, EtlxOptions } from '../builder'
import { commands } from '.'

const args = (...xs: string[]) => ['node', 'scriptpath', ...xs]

describe('command', () => {
    it('add command', () => {
        let cmd0 = () => new commander.Command()
        let cmd1 = () => new commander.Command()

        let init: EtlxOptions = { commands: [cmd0], configurations: [], observables: [] }

        let actual = commands(cmd1)(init)

        let expected: EtlxOptions = {
            commands: [cmd0, cmd1],
            configurations: [],
            observables: [],
        }

        expect(actual).toEqual(expected)
    })

    it('add multiple commands', () => {
        let cmd0 = () => new commander.Command()
        let cmd1 = () => new commander.Command()
        let cmd2 = () => new commander.Command()

        let init: EtlxOptions = { commands: [cmd0], configurations: [], observables: [] }

        let actual = commands(cmd1, cmd2)(init)

        let expected: EtlxOptions = {
            commands: [cmd0, cmd1, cmd2],
            configurations: [],
            observables: [],
        }

        expect(actual).toEqual(expected)
    })

    it('throw on invalid command', () => {
        let actual = () => etlx(commands(42 as any))

        expect(actual).toThrowError('Unable to configure - all commands must be functions, but some were not')
    })

    it('show help when no command specified', () => {
        let actual = ''
        let restore = mockStd(process.stdout, x => actual = x)

        etlx()(args())

        expect(process.exitCode).toEqual(1)
        expect(actual).not.toHaveLength(0)

        restore()
    })
})


function mockStd(stream: WriteStream, f: (str: string) => void) {
    let spy = jest.spyOn(stream, 'write')
    let write = (x: string) => {
        f(x)
        return true
    }

    spy.mockImplementationOnce(write)

    return () => {
        spy.mockRestore()
        spy.mockReset()
    }
}