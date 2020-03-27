import { WriteStream } from 'tty'
import commander from 'commander'
import { Observable } from 'rxjs'
import { EtlPipe } from '../pipe'
import { etlx, CliCommand } from './etlx'

const pipe: EtlPipe = () => (o: Observable<any>) => o

const args = (...xs: string[]) => ['node', 'scriptpath', ...xs]

describe('etlx', () => {
    it('configuration functions must not mutate builder', () => {
        const sut = etlx()

        expect(
            sut === sut.configure(x => x) ||
            sut === sut.pipe(pipe) ||
            sut === sut.pipe(pipe, 'test') ||
            sut === sut.pipe([pipe]) ||
            sut === sut.pipe({ pipe }),
        ).toBeFalsy()
    })

    it('add command', () => {
        let action = jest.fn()

        etlx()
        .command(x => x.command('test').action(action))
        .build()
        .run(args('test'))

        expect(action).toHaveBeenCalledTimes(1)
    })

    it('add multiple commands via single method call', () => {
        let commands = ['A', 'B', 'C', 'D']

        let testData: [CliCommand, jest.Mock, string][] = commands.map((name) => {
            let mock = jest.fn()

            let cmd = (cli: commander.Command) => cli.command(name).action(mock)

            return [cmd, mock, name]
        })

        let sut = etlx().command(...testData.map(([x]) => x)).build()

        testData.forEach(([_, f, name]) => {
            sut.run(args(name))

            expect(f).toHaveBeenCalledTimes(1)
        })
    })

    it('add multiple commands via multiple method calls', () => {
        let commands = ['A', 'B', 'C', 'D']

        let testData: [CliCommand, jest.Mock, string][] = commands.map((name) => {
            let mock = jest.fn()

            let cmd = (cli: commander.Command) => cli.command(name).action(mock)

            return [cmd, mock, name]
        })

        let sut = testData.reduce((sut, [cmd]) => sut.command(cmd), etlx()).build()

        testData.forEach(([_, f, name]) => {
            sut.run(args(name))

            expect(f).toHaveBeenCalledTimes(1)
        })
    })

    it('throw on invalid command', () => {
        let actual = () => etlx().command(42 as any)

        expect(actual).toThrowError('Unable to add command - function is expected, but got number')
    })

    it('show help when no command specified', () => {
        let actual = ''
        let restore = mockStd(process.stdout, x => actual = x)

        etlx().build().run(args())

        expect(process.exitCode).toEqual(1)
        expect(actual).not.toHaveLength(0)

        restore()
    })
})


function mockStd(stream: WriteStream, f: (str: string) => void, ) {
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