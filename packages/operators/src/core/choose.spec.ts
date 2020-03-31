import { of } from 'rxjs'
import { choose } from './choose'
import { map } from 'rxjs/operators'

describe('choose', () => {
    it('single operator, true condition', async () => {
        const source = of(41)

        const expected = 42
        const actual = await source.pipe(choose(true, map(x => x + 1))).toPromise()

        expect(actual).toEqual(expected)

    })

    it('single operator, false condition', async () => {
        const source = of(42)

        const expected = 42
        const actual = await source.pipe(choose(false, map(x => x + 1))).toPromise()

        expect(actual).toEqual(expected)
    })

    it('two operators, true condition', async () => {
        const source = of(41)

        const expected = 42
        const actual = await source.pipe(choose(true, map(x => x + 1), map(x => x - 1))).toPromise()

        expect(actual).toEqual(expected)

    })

    it('two operators, false condition', async () => {
        const source = of(43)

        const expected = 42
        const actual = await source.pipe(choose(false, map(x => x + 1), map(x => x - 1))).toPromise()

        expect(actual).toEqual(expected)
    })

    it('different return types', async () => {
        const source = of(42)

        const expected = '42'
        const actual = await source.pipe(choose(false, map(x => x + 1), map(x => x.toString(10)))).toPromise()

        expect(actual).toEqual(expected)
    })
})