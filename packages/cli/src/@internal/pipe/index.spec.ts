import { interval, of, Observable } from 'rxjs'
import { mergeMap, take, toArray, map } from 'rxjs/operators'
import { createPipeline, Pipes, EtlPipe } from '../pipe'

describe('createPipeline', () => {
    let sourceA: EtlPipe = () => s => s.pipe(
        mergeMap(() => interval(10).pipe(take(3))),
        map(x => `A${x}`),
    )

    let sourceB: EtlPipe = () => s => s.pipe(
        mergeMap(() => interval(12).pipe(take(3))),
        map(x => `B${x}`),
    )

    it('sequential', async () => {
        let $ = testSequential({ A: sourceA, B: sourceB })

        let expected = ['A0', 'A1', 'A2', 'B0', 'B1', 'B2']
        let actual = await $.pipe(toArray()).toPromise()

        expect(actual).toEqual(expected)
    })

    it('concurrent', async () => {
        let $ = testConcurrent({ A: sourceA, B: sourceB })

        let expected = ['A0', 'B0', 'A1', 'B1', 'A2', 'B2']
        let actual = await $.pipe(toArray()).toPromise()

        expect(actual).toEqual(expected)
    })

    it('sequential respect order', async () => {
        let $ = testSequential({ A: sourceA, B: sourceB }, ['B', 'A'])

        let expected = ['B0', 'B1', 'B2', 'A0', 'A1', 'A2']
        let actual = await $.pipe(toArray()).toPromise()

        expect(actual).toEqual(expected)
    })

    it('sequential filter', async () => {
        let $ = testSequential({ A: sourceA, B: sourceB }, ['B'])

        let expected = ['B0', 'B1', 'B2']
        let actual = await $.pipe(toArray()).toPromise()

        expect(actual).toEqual(expected)
    })

    it('concurrent filter', async () => {
        let $ = testConcurrent({ A: sourceA, B: sourceB }, ['B'])

        let expected = ['B0', 'B1', 'B2']
        let actual = await $.pipe(toArray()).toPromise()

        expect(actual).toEqual(expected)
    })

    it('short-form operator', async () => {
        let $ = testSequential({ A: () => of(42) })

        let expected = [42]
        let actual = await $.pipe(toArray()).toPromise()

        expect(actual).toEqual(expected)
    })

    it('observable operator', async () => {
        let $ = testSequential({ A: of(42) })

        let expected = [42]
        let actual = await $.pipe(toArray()).toPromise()

        expect(actual).toEqual(expected)
    })

    it('throw on invalid operator', () => {
        let actual = () => testSequential({ A: 42 as any })

        expect(actual).toThrowError()
    })
})


function testSequential<T = any>(pipes: { [name: string]: EtlPipe }, filter?: string[]): Observable<T> {
    let pipeline = mapObjPipesToArray(pipes)

    let operator = createPipeline(pipeline, filter || [], false)({})

    return of(undefined).pipe(operator)
}

function testConcurrent<T = any>(pipes: { [name: string]: EtlPipe }, filter?: string[]): Observable<T> {
    let pipeline = mapObjPipesToArray(pipes)

    let operator = createPipeline(pipeline, filter || [], true)({})

    return of(undefined).pipe(operator)
}

function mapObjPipesToArray(pipes: { [name: string]: EtlPipe }): Pipes {
    return Object.entries(pipes).map(([name, pipe]) => ({ name, pipe }))
}