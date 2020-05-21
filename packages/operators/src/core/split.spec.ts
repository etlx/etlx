/* eslint-disable @typescript-eslint/no-unused-vars */
import { Observable, of, range } from 'rxjs'
import { map, toArray, mapTo, delay } from 'rxjs/operators'
import { split } from './split'

describe('split', () => {
    it('can duplicate value', async () => {
        let $ = of(0).pipe(split())

        let actual = await $.pipe(toArray()).toPromise()
        let expected = [[0, 0]]

        expect(actual).toEqual(expected)
    })

    it('can emit single child value', async () => {
        let $ = range(0, 3).pipe(
            split(mapTo(42)),
        )

        let actual = await $.pipe(toArray()).toPromise()
        let expected = [[0, 42], [1, 42], [2, 42]]

        expect(actual).toEqual(expected)
    })

    it('preserve order', async () => {
        let $ = range(0, 3).pipe(
            split(delay(10)),
        )

        let actual = await $.pipe(toArray()).toPromise()
        let expected = [[0, 0], [1, 1], [2, 2]]

        expect(actual).toEqual(expected)
    })
})

describe('split typings', () => {
    it('support no operators', async () => {
        let observable = of(0).pipe(
            split(),
        )

        // TS will fail to compile if typings are wrong
        assertType(observable)

        function assertType(_: Observable<[number, number]>) {}
    })

    it('support type inference up to 9 operators', async () => {
        let observable = of<0>().pipe(
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
        let observable = of<0>().pipe(
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
