import { EventEmitter } from 'events'
import { fromEventEmitter, FromEventEmitterOptions } from './fromEventEmitter'

const defaultOptions: FromEventEmitterOptions = {
    next: ['next'],
    complete: ['complete'],
    error: ['error'],
}

describe('fromEventEmitter', () => {
    it('call next', () => {
        let emitter = new EventEmitter()
        let next = jest.fn()

        let sub = fromEventEmitter(emitter, defaultOptions).subscribe({ next })

        emitter.emit('next', 42)
        sub.unsubscribe()

        expect(next).toBeCalledWith({ event: 'next', args: [42] })
    })

    it('call complete', () => {
        let emitter = new EventEmitter()
        let complete = jest.fn()

        let sub = fromEventEmitter(emitter, defaultOptions).subscribe({ complete })

        emitter.emit('complete', 42)
        sub.unsubscribe()

        expect(complete).toBeCalledWith()
    })

    it('call error', () => {
        let emitter = new EventEmitter()
        let error = jest.fn()

        let sub = fromEventEmitter(emitter, defaultOptions).subscribe({ error })

        emitter.emit('error', 42)
        sub.unsubscribe()

        expect(error).toBeCalledWith(42)
    })

    it('next selector', () => {
        let emitter = new EventEmitter()
        let next = jest.fn()
        let opts: FromEventEmitterOptions<string> = {
            ...defaultOptions,
            nextSelector: (e, [n]) => `${e} ${n}`,
        }

        let sub = fromEventEmitter(emitter, opts).subscribe({ next })

        emitter.emit('next', 42)
        sub.unsubscribe()

        expect(next).toBeCalledWith('next 42')
    })

    it('single event for next and complete', () => {
        let emitter = new EventEmitter()
        let next = jest.fn()
        let complete = jest.fn()
        let opts: FromEventEmitterOptions = { complete: ['test'], next: ['test'] }

        let sub = fromEventEmitter(emitter, opts).subscribe({ next, complete })

        emitter.emit('test', 42)
        sub.unsubscribe()

        expect(next).toBeCalledTimes(1)
        expect(complete).toBeCalledTimes(1)
    })

    it('don`t add multiple listeners for same event', () => {
        let emitter = new EventEmitter()
        let next = jest.fn()
        let opts: FromEventEmitterOptions = { next: ['test', 'test', 'test'] }

        let sub = fromEventEmitter(emitter, opts).subscribe({ next })

        emitter.emit('test', 42)
        sub.unsubscribe()

        expect(next).toBeCalledTimes(1)
    })

    it('remove listener on unsubscription', () => {
        let emitter = new EventEmitter()
        let counts = (...events: string[]) => events.map(x => emitter.listenerCount(x))

        let sub = fromEventEmitter(emitter, defaultOptions).subscribe()

        expect(counts('next', 'complete', 'error')).toEqual([1, 1, 1])

        emitter.emit('test')
        sub.unsubscribe()

        expect(counts('next', 'complete', 'error')).toEqual([0, 0, 0])
    })
})
