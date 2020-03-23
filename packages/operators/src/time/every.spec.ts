import { of } from 'rxjs'
import { take, toArray } from 'rxjs/operators'
import { every } from '.'

describe('every', () => {
    it('can use milliseconds number', async () => {
        const sut = of(undefined).pipe(every(5), take(3))

        const expected = [0, 1, 2]
        const actual = await sut.pipe(toArray()).toPromise()

        expect(actual).toEqual(expected)
    })

    it('can use milliseconds string', async () => {
        const sut = of(undefined).pipe(every('5'), take(3))

        const expected = [0, 1, 2]
        const actual = await sut.pipe(toArray()).toPromise()

        expect(actual).toEqual(expected)
    })

    it('can use duration string', async () => {
        const sut = of(undefined).pipe(every('5 milliseconds'), take(3))

        const expected = [0, 1, 2]
        const actual = await sut.pipe(toArray()).toPromise()

        expect(actual).toEqual(expected)
    })
})