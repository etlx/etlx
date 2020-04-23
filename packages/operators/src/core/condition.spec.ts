import { condition } from './condition'
import { range } from 'rxjs'
import { map, toArray, mapTo } from 'rxjs/operators'

const even = (x: number) => x % 2 === 0
const double = (x: number) => x * 2

describe('condition', () => {
    it('emit truthy first', async () => {
        let $ = range(0, 6).pipe(
            condition(even, mapTo(true), mapTo(false)),
        )

        let actual = await $.pipe(toArray()).toPromise()

        let expected = [
            true, true, true,    // even
            false, false, false, // odd
        ]

        expect(actual).toEqual(expected)
    })

    it('if false branch absent use identity', async () => {
        let $ = range(0, 6).pipe(
            condition(even, map(double)),
        )

        let actual = await $.pipe(toArray()).toPromise()

        let expected = [
            0, 4, 8, // even
            1, 3, 5, // odd
        ]

        expect(actual).toEqual(expected)
    })


})