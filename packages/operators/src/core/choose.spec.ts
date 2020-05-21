import { of } from 'rxjs'
import { map } from 'rxjs/operators'
import { choose } from './choose'

describe('choose', () => {
    it('single operator, true condition', async () => {
        let source = of(41)

        let expected = 42
        let actual = await source.pipe(choose(true, map(x => x + 1))).toPromise()

        expect(actual).toEqual(expected)
    })

    it('single operator, false condition', async () => {
        let source = of(42)

        let expected = 42
        let actual = await source.pipe(choose(false, map(x => x + 1))).toPromise()

        expect(actual).toEqual(expected)
    })

    it('two operators, true condition', async () => {
        let source = of(41)

        let expected = 42
        let actual = await source.pipe(choose(true, map(x => x + 1), map(x => x - 1))).toPromise()

        expect(actual).toEqual(expected)
    })

    it('two operators, false condition', async () => {
        let source = of(43)

        let expected = 42
        let actual = await source.pipe(choose(false, map(x => x + 1), map(x => x - 1))).toPromise()

        expect(actual).toEqual(expected)
    })

    it('different return types', async () => {
        let source = of(42)

        let expected = '42'
        let actual = await source.pipe(choose(false, map(x => x + 1), map(x => x.toString(10)))).toPromise()

        expect(actual).toEqual(expected)
    })
})
