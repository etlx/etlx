import { interval, of, Observable, OperatorFunction } from 'rxjs'
import { mergeMap, take, toArray, map } from 'rxjs/operators'
import { createPipeline, Pipes } from '../pipe'

type Etl = (config: any) => OperatorFunction<void, any>

describe('createPipeline', () => {
    const sourceA: Etl = () => s => s.pipe(
        mergeMap(() => interval(10).pipe(take(3))),
        map(x => `A${x}`),
    )

    const sourceB: Etl = () => s => s.pipe(
        mergeMap(() => interval(12).pipe(take(3))),
        map(x => `B${x}`),
    )

    it('sequential', async () => {
        const observable = testSequential({ A: sourceA, B: sourceB }, ['A', 'B'])

        const expected = ['A0', 'A1', 'A2', 'B0', 'B1', 'B2']
        const actual = await observable.pipe(toArray()).toPromise()

        expect(actual).toEqual(expected)
    })

    it('concurrent', async () => {
        const observable = testConcurrent({ A: sourceA, B: sourceB }, ['A', 'B'])

        const expected = ['A0', 'B0', 'A1', 'B1', 'A2', 'B2']
        const actual = await observable.pipe(toArray()).toPromise()

        expect(actual).toEqual(expected)
    })

    it('sequential respect order', async () => {
        const observable = testSequential({ A: sourceA, B: sourceB }, ['B', 'A'])

        const expected = ['B0', 'B1', 'B2', 'A0', 'A1', 'A2']
        const actual = await observable.pipe(toArray()).toPromise()

        expect(actual).toEqual(expected)
    })

    it('sequential filter', async () => {
        const observable = testSequential({ A: sourceA, B: sourceB }, ['B'])

        const expected = ['B0', 'B1', 'B2']
        const actual = await observable.pipe(toArray()).toPromise()

        expect(actual).toEqual(expected)
    })

    it('concurrent filter', async () => {
        const observable = testConcurrent({ A: sourceA, B: sourceB }, ['B'])

        const expected = ['B0', 'B1', 'B2']
        const actual = await observable.pipe(toArray()).toPromise()

        expect(actual).toEqual(expected)
    })

    it('run all on when scripts empty', async () => {
        const observable = testSequential({ A: sourceA, B: sourceB }, [])

        const expected = ['A0', 'A1', 'A2', 'B0', 'B1', 'B2']
        const actual = await observable.pipe(toArray()).toPromise()

        expect(actual).toEqual(expected)
    })
})


function testSequential<T = any>(pipes: { [name: string]: Etl }, filter: string[]): Observable<T> {
    const pipeline = mapObjPipesToArray(pipes)

    const operator = createPipeline(pipeline, filter, false)({})

    return of(undefined).pipe(operator)
}

function testConcurrent<T = any>(pipes: { [name: string]: Etl }, filter: string[]): Observable<T> {
    const pipeline = mapObjPipesToArray(pipes)

    const operator = createPipeline(pipeline, filter, true)({})

    return of(undefined).pipe(operator)
}

function mapObjPipesToArray(pipes: { [name: string]: Etl }): Pipes {
    return Object.entries(pipes)
        .filter(([_, pipe]) => typeof pipe === 'function')
        .map(([name, pipe]) => ({ name, pipe }))
}