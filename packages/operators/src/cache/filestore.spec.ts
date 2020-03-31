import fs from 'fs'
import path from 'path'
import { filestore } from './filestore'
import { from, interval, concat } from 'rxjs'
import { toArray, map, take } from 'rxjs/operators'

const file = (filepath: string) => fs.readFileSync(filepath, 'utf-8')
const stringify = (x: any) => JSON.stringify(x)
const join = (xs: any[]) => xs.map(stringify).join('\n').concat('\n')

const ensureExists = (dir: string) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
    }
    return dir
}

describe('cache/filestore', () => {
    let dir = ensureExists('./data')

    it('can write', async () => {
        let filepath = path.join(dir, 'can-write.txt')
        let { write } = filestore(filepath)

        let actual = await from([1, 2, 3]).pipe(write, toArray()).toPromise()
        let expected = [1, 2, 3]

        expect(actual).toEqual(expected)

        expect(file(filepath)).toEqual(join(expected))
    })

    it('can write in order', async () => {
        let filepath = path.join(dir, 'can-write-in-order.txt')
        let { write } = filestore<number>(filepath)

        let $1 = interval(10).pipe(map(x => x + 1), take(3))
        let $2 = interval(11).pipe(map(x => x + 4), take(3))
        let $3 = interval(12).pipe(map(x => x + 7), take(3))
        let $ = concat($1, $2, $3)

        let actual = await $.pipe(write, toArray()).toPromise()
        let expected = [1, 2, 3, 4, 5, 6, 7, 8, 9]

        expect(actual).toEqual(expected)

        expect(file(filepath)).toEqual(join(expected))
    })

    it('can write json', async () => {
        let filepath = path.join(dir, 'can-write-json.txt')
        let { write } = filestore<any>(filepath)

        let $1 = interval(10).pipe(map(x => x + 1), take(3))
        let $2 = interval(11).pipe(map(x => x + 4), take(3))
        let $3 = interval(12).pipe(map(x => x + 7), take(3))
        let $ = concat($1, $2, $3).pipe(map(n => ({ n })))

        let actual = await $.pipe(write, toArray()).toPromise()
        let expected = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => ({ n }))

        expect(actual).toEqual(expected)
        expect(file(filepath)).toEqual(join(expected))
    })
})