import { of } from 'rxjs'
import { readFile } from './readFile'
import { resolve, parse } from 'path'

const filepath = resolve(`${__dirname}/test/test.txt`)

describe('readFile', () => {
    it('can read file by string input', async () => {
        const observable = of(filepath).pipe(readFile())

        const expected = {
            ...parse(filepath),
            content: 'test',
        }

        const actual = await observable.toPromise()

        expect(actual).toEqual(expected)
    })

    it('can read file by object input', async () => {
        const input = { ...parse(filepath), test: 42 }
        const observable = of(input).pipe(readFile())

        const expected = {
            ...input,
            content: 'test',
        }

        const actual = await observable.toPromise()

        expect(actual).toEqual(expected)
    })

    it('throw if file not exists', async () => {
        const observable = of('./unknow').pipe(readFile())

        await expect(observable.toPromise()).rejects.toThrow()
    })
})