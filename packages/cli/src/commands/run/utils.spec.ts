import { interval, of, Observable } from 'rxjs'
import { mergeMap, take, toArray, map } from 'rxjs/operators'
import { createPipeline } from './utils'
import { EtlxOperator, InternalOperator } from '../../observe'
import { Observable as EtlxObservable } from '../../utils/observable'

describe('createPipeline', () => {
    let sourceA: EtlxOperator = () => of(undefined).pipe(
        mergeMap(() => interval(10).pipe(take(3))),
        map(x => `A${x}`),
    )

    let sourceB: EtlxOperator = () => of(undefined).pipe(
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

    it('throw on invalid operator', () => {
        let actual = () => testSequential({ A: 42 as any })

        expect(actual).toThrowError()
    })
})


function testSequential<T = any>(pipes: { [name: string]: EtlxOperator }, filter?: string[]): Observable<T> {
    let pipeline = mapObjPipesToArray(pipes)

    let operator = createPipeline(pipeline, filter || [], false)

    return convertObservables(operator({}))
}

function testConcurrent<T = any>(pipes: { [name: string]: EtlxOperator }, filter?: string[]): Observable<T> {
    let pipeline = mapObjPipesToArray(pipes)

    let operator = createPipeline(pipeline, filter || [], true)

    return convertObservables(operator({}))
}

function mapObjPipesToArray(pipes: { [name: string]: EtlxOperator }): InternalOperator[] {
    return Object.entries(pipes).map(([name, observable]) => ({ name, observable }))
}

function convertObservables<T>($: EtlxObservable<T>): Observable<T> {
    return new Observable(x => $.subscribe(x))
}
