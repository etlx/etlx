import { interval, of, Observable, OperatorFunction } from 'rxjs'
import { mergeMap, take, toArray, map } from 'rxjs/operators'
import { createPipeline, Pipes } from '../pipe'

type Etl = (config: any) => OperatorFunction<void, any>

describe('createPipeline', () => {
    let sourceA: Etl = () => s => s.pipe(
        mergeMap(() => interval(10).pipe(take(3))),
        map(x => `A${x}`),
    )

    let sourceB: Etl = () => s => s.pipe(
        mergeMap(() => interval(12).pipe(take(3))),
        map(x => `B${x}`),
    )

    it('sequential', async () => {
        let observable = testSequential({ A: sourceA, B: sourceB }, ['A', 'B'])

        let expected = ['A0', 'A1', 'A2', 'B0', 'B1', 'B2']
        let actual = await observable.pipe(toArray()).toPromise()

        expect(actual).toEqual(expected)
    })

    it('concurrent', async () => {
        let observable = testConcurrent({ A: sourceA, B: sourceB }, ['A', 'B'])

        let expected = ['A0', 'B0', 'A1', 'B1', 'A2', 'B2']
        let actual = await observable.pipe(toArray()).toPromise()

        expect(actual).toEqual(expected)
    })

    it('sequential respect order', async () => {
        let observable = testSequential({ A: sourceA, B: sourceB }, ['B', 'A'])

        let expected = ['B0', 'B1', 'B2', 'A0', 'A1', 'A2']
        let actual = await observable.pipe(toArray()).toPromise()

        expect(actual).toEqual(expected)
    })

    it('sequential filter', async () => {
        let observable = testSequential({ A: sourceA, B: sourceB }, ['B'])

        let expected = ['B0', 'B1', 'B2']
        let actual = await observable.pipe(toArray()).toPromise()

        expect(actual).toEqual(expected)
    })

    it('concurrent filter', async () => {
        let observable = testConcurrent({ A: sourceA, B: sourceB }, ['B'])

        let expected = ['B0', 'B1', 'B2']
        let actual = await observable.pipe(toArray()).toPromise()

        expect(actual).toEqual(expected)
    })

    it('run all on when scripts empty', async () => {
        let observable = testSequential({ A: sourceA, B: sourceB }, [])

        let expected = ['A0', 'A1', 'A2', 'B0', 'B1', 'B2']
        let actual = await observable.pipe(toArray()).toPromise()

        expect(actual).toEqual(expected)
    })
})


function testSequential<T = any>(pipes: { [name: string]: Etl }, filter: string[]): Observable<T> {
    let pipeline = mapObjPipesToArray(pipes)

    let operator = createPipeline(pipeline, filter, false)({})

    return of(undefined).pipe(operator)
}

function testConcurrent<T = any>(pipes: { [name: string]: Etl }, filter: string[]): Observable<T> {
    let pipeline = mapObjPipesToArray(pipes)

    let operator = createPipeline(pipeline, filter, true)({})

    return of(undefined).pipe(operator)
}

function mapObjPipesToArray(pipes: { [name: string]: Etl }): Pipes {
    return Object.entries(pipes)
        .filter(([_, pipe]) => typeof pipe === 'function')
        .map(([name, pipe]) => ({ name, pipe }))
}