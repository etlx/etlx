import { promisify } from '../@internal/utils'
import { toTable, ToTableOptions } from './toTable'
import { from } from 'rxjs'
import { toArray } from 'rxjs/operators'

const sut = promisify(toTable)

describe('toTable', () => {
    it('empty transform', async () => {
        let init = {}

        let actual = await sut(init)

        let expected: any[][] = [[]]

        expect(actual).toEqual(expected)
    })

    it('default transform', async () => {
        let init = { a: 1, c: 3, b: 2 }

        let actual = await sut(init)

        let expected: any[][] = [
            [1, 3, 2],
        ]

        expect(actual).toEqual(expected)
    })

    it('keys transform only specified props', async () => {
        let init = { a: 1, b: 2, c: 3 }

        let actual = await sut(init, { keys: ['c', 'a'] })

        let expected = [[3, 1]]

        expect(actual).toEqual(expected)
    })

    it('headers options prepends headers to stream', async () => {
        let init = { a: 1, b: 2, c: 3 }

        let actual = await sut(init, { headers: { a: 'A', b: 'B', c: 'C' } })

        let expected = [
            ['A', 'B', 'C'],
            [1, 2, 3],
        ]

        expect(actual).toEqual(expected)
    })

    it('use key when property header not specified', async () => {
        let init = { a: 1, b: 2, c: 3 }

        let actual = await sut(init, { headers: { a: 'A', c: 'C' } })

        let expected = [
            ['A', 'b', 'C'],
            [1, 2, 3],
        ]

        expect(actual).toEqual(expected)
    })

    it('use headers row only once per stream', async () => {
        let init = [
            { a: 1, b: 2, c: 3 },
            { a: 4, b: 5, c: 6 },
        ]
        let headers = { a: 'A', b: 'B', c: 'C' }

        let actual = await from(init)
            .pipe(toTable({ headers }), toArray())
            .toPromise()

        let expected = [
            ['A', 'B', 'C'],
            [1, 2, 3],
            [4, 5, 6],
        ]

        expect(actual).toEqual(expected)
    })

    it('values option allows mapping of incoming object', async () => {
        let init = { a: 1, b: 2, c: 3 }
        let values = (x: any) => Object.values(x).map((x: number) => x + 1)

        let actual = await sut(init, { values })

        let expected = [[2, 3, 4]]

        expect(actual).toEqual(expected)
    })

    it('stringify allows custom property formatting', async () => {
        let init = { a: 1, b: 2, c: 3 }
        let stringify = (x: number) => x.toPrecision(2)

        let actual = await sut(init, { stringify })

        let expected = [['1.0', '2.0', '3.0']]

        expect(actual).toEqual(expected)
    })



    it('throw on non-object values', async () => {
        let init = 42

        let actual = sut(init)

        await expect(actual).rejects.toThrowError('Unexpected stream value type. [object] expected but [number] received')
    })

    let keys: Array<keyof ToTableOptions> = ['headers', 'keys', 'values', 'stringify']
    keys
    .forEach(key => it(`throw on invalid ${key} option type`, () => {
        let actual = () => toTable({ [key]: 42 as any })

        expect(actual).toThrowError(/Unexpected '\w+' option type. \[\w+\] expected but \[\w+\] received/)
    }))

    it('throw on invalid values return type', async () => {
        let values = () => 42 as any

        let actual = sut({}, { values })

        await expect(actual).rejects.toThrowError("Unexpected 'values' option type. [Array] expected but [number] received")
    })

    it('throw on invalid size of values return value', async () => {
        let init = { a: 1, b: 2, c: 3 }
        let values = () => [1, 3]

        let actual = sut(init, { values, keys: ['a', 'b', 'c'] })

        expect(actual).rejects.toThrowError("Invalid 'values' option return value. Expected 3 elements, received 2")
    })
})