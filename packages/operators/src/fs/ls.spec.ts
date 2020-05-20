import { ls } from './ls'
import { toArray, map } from 'rxjs/operators'

const testdir = `${__dirname}/test/ls`

describe('ls', () => {
    it('can list', async () => {
        const $ = ls(testdir)

        const actual = await $.pipe(map(x => x.base), toArray()).toPromise()

        const expected = ['1', '2', 'test.txt']

        expect(actual).toEqual(expected)
    })

    it('can list recursively', async () => {
        const $ = ls(testdir, { recursive: true })

        const actual = await $.pipe(map(x => x.base), toArray()).toPromise()

        const expected = ['1', '2', 'test.txt', '1.2', '1.txt', '2.txt', '1.2.txt']

        expect(actual).toEqual(expected)
    })

    it('return input on file path', async () => {
        const $ = ls(`${testdir}/test.txt`)

        const actual = await $.pipe(map(x => x.base), toArray()).toPromise()

        const expected = ['test.txt']

        expect(actual).toEqual(expected)
    })

    it('throw unexisting file', async () => {
        const $ = ls('./unknow/dir')

        const actual = $.pipe(toArray()).toPromise()

        await expect(actual).rejects.toThrowError("ENOENT: no such file or directory, lstat './unknow/dir'")
    })

    it('throw on null', () => {
        const actual = () => ls(null as any)

        expect(actual).toThrowError('basePath must be string')
    })

    it('throw on undefined', () => {
        const actual = () => ls(undefined as any)

        expect(actual).toThrowError('basePath must be string')
    })
})