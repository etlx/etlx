import { Observable, of, range, interval } from 'rxjs'
import { map, toArray, take } from 'rxjs/operators'
import { split } from './split'

describe('split', () => {
    it('can duplicate value', () => {
        const source = of(0)

        const observable = source.pipe(split())

        observable.subscribe((actual) => {
            const expected = [0, 0]

            expect(actual).toEqual(expected)
        })
    })

    it('can emit single child value', () => {
        const source = range(0, 3)
        const observable = source.pipe(
            split(
                () => of(42),
            ),
        )

        observable.pipe(toArray()).subscribe((actual) => {
            const expected = [[0, 42], [1, 42], [2, 42]]

            expect(actual).toEqual(expected)
        })
    })

    it('can emit multiple child values', () => {
        const source = range(0, 3)
        const observable = source.pipe(
            split(
                () => range(0, 2),
            ),
        )

        observable.pipe(toArray()).subscribe((actual) => {
            const expected = [[0, 1], [0, 2], [1, 1], [1, 2]]

            expect(actual).toEqual(expected)
        })
    })

    it('ignore emit order', () => {
        const source = interval(50)
        const observable = source.pipe(
            split(
                () => interval(500),
                take(2),
            ),
        )

        observable.pipe(take(2), toArray()).subscribe((actual) => {
            const expected = [[0, 0], [1, 0], [0, 1], [1, 1]]

            expect(actual).toEqual(expected)
        })
    })
})

describe('split typings', () => {
    it('support no operators', async () => {
        const observable = of(0).pipe(
            split(),
        )

        // TS will fail to compile if typings are wrong
        assertType(observable)

        function assertType(_: Observable<[number, number]>) {}
    })

    it('support type inference up to 9 operators', async () => {
        const observable = of<0>().pipe(
            split(
                map<0, 1>(() => 1),
                map<1, 2>(() => 2),
                map<2, 3>(() => 3),
                map<3, 4>(() => 4),
                map<4, 5>(() => 5),
                map<5, 6>(() => 6),
                map<6, 7>(() => 7),
                map<7, 8>(() => 8),
                map<8, 9>(() => 9),
            ),
        )

        // TS will fail to compile if typings are wrong
        assertType(observable)

        function assertType(_: Observable<[0, 9]>) {}
    })

    it('support spread operator', async () => {
        const observable = of<0>().pipe(
            split<0, 2>(...[
                map<0, 1>(() => 1),
                map<1, 2>(() => 2),
            ]),
        )

        // TS will fail to compile if typings are wrong
        assertType(observable)

        function assertType(_: Observable<[0, 2]>) {}
    })
})
