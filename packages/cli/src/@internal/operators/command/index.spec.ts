import { WriteStream } from 'tty'
import commander from 'commander'
import { etlx } from '../../etlx'
import { command } from '.'
import { EtlxCliCommand } from '../../types'

const args = (...xs: string[]) => ['node', 'scriptpath', ...xs]

describe('addCommand', () => {
    it('add command', () => {
        let action = jest.fn()

        etlx(
            command(x => x.command('test').action(action)),
        )(args('test'))

        expect(action).toHaveBeenCalledTimes(1)
    })

    it('add multiple commands', () => {
        let commands = ['A', 'B', 'C', 'D']

        let testData: [EtlxCliCommand, jest.Mock, string][] = commands.map((name) => {
            let mock = jest.fn()

            let cmd = (cli: commander.Command) => cli.command(name).action(mock)

            return [cmd, mock, name]
        })



        let sut = etlx(
            command(
                ...testData.map(([x]) => x),
            ),
        )

        testData.forEach(([_, f, name]) => {
            sut(args(name))

            expect(f).toHaveBeenCalledTimes(1)
        })
    })

    it('throw on invalid command', () => {
        let actual = () => etlx(
            command(42 as any),
        )

        expect(actual).toThrowError('Unable to add command - function is expected, but got number')
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