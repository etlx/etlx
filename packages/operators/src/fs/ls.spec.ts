import { of } from 'rxjs'
import { ls, LsItem } from './ls'
import { toArray, map } from 'rxjs/operators'

const testdir = `${__dirname}/test`

describe('ls', () => {
    it('can list', async () => {
        const observable = of(testdir).pipe(
            ls(),
        )

        const actual = await observable.pipe(map(x => x.base), toArray()).toPromise()

        const expected = ['test', '1', '2', 'test.txt']

        expect(actual).toEqual(expected)
    })

    it('can list files', async () => {
        const observable = of(testdir).pipe(
            ls({ filesOnly: true }),
        )

        const actual = await observable.pipe(map(x => x.base), toArray()).toPromise()

        const expected = ['test.txt']

        expect(actual).toEqual(expected)
    })

    it('can list recursively', async () => {
        const observable = of(testdir).pipe(
            ls({ recursive: true }),
        )

        const actual = await observable.pipe(map(x => x.base), toArray()).toPromise()

        const expected = ['test', '1', '1.2', '1.2.txt', '1.txt', '2', '2.txt', 'test.txt']

        expect(actual).toEqual(expected)
    })

    it('can list files recursively', async () => {
        const observable = of(testdir).pipe(
            ls({ filesOnly: true, recursive: true }),
        )

        const actual = await observable.pipe(map(x => x.base), toArray()).toPromise()

        const expected = ['1.2.txt', '1.txt', '2.txt', 'test.txt']

        expect(actual).toEqual(expected)
    })

    it('can list with pattern', async () => {
        const observable = of(testdir).pipe(
            ls({ pattern: '*.txt' }),
        )

        const actual = await observable.pipe(map(x => x.base), toArray()).toPromise()

        const expected = ['test.txt']

        expect(actual).toEqual(expected)
    })

    it('can list with pattern recursively', async () => {
        const observable = of(testdir).pipe(
            ls({ pattern: '1*', recursive: true }),
        )

        const actual = await observable.pipe(map(x => x.base), toArray()).toPromise()

        const expected = ['1', '1.2', '1.2.txt', '1.txt']

        expect(actual).toEqual(expected)
    })

    it('can list files with pattern recursively', async () => {
        const observable = of(testdir).pipe(
            ls({ pattern: '1*', recursive: true, filesOnly: true }),
        )

        const actual = await observable.pipe(map(x => x.base), toArray()).toPromise()

        const expected = ['1.2.txt', '1.txt']

        expect(actual).toEqual(expected)
    })

    it('return input on file path', async () => {
        const observable = of(`${testdir}/test.txt`).pipe(ls())

        const actual = await observable.pipe(map(x => x.base), toArray()).toPromise()

        const expected = ['test.txt']

        expect(actual).toEqual(expected)
    })

    it('skips unexisting file', async () => {
        const observable = of('./unknow/dir').pipe(ls())

        const actual = await observable.pipe(toArray()).toPromise()

        const expected: LsItem[] = []

        expect(actual).toEqual(expected)
    })

    it('skips on null', async () => {
        const observable = of(null as any).pipe(ls())

        const actual = await observable.pipe(toArray()).toPromise()

        const expected: LsItem[] = []

        expect(actual).toEqual(expected)
    })

    it('skips on undefined', async () => {
        const observable = of(undefined as any).pipe(ls())

        const actual = await observable.pipe(toArray()).toPromise()

        const expected: LsItem[] = []

        expect(actual).toEqual(expected)
    })

    it('can list with basedir option', async () => {
        const observable = of(undefined).pipe(ls({ basedir: testdir }))

        const actual = await observable.pipe(map(x => x.base), toArray()).toPromise()

        const expected = ['test', '1', '2', 'test.txt']

        expect(actual).toEqual(expected)
    })

})