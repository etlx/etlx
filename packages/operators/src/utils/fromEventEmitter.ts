import { Observable } from 'rxjs'

const defaultNextSelector = (event: string, args: any[]): Event => ({ event, args })
const defaultErrorEvents = ['error']
const defaultCompleteEvents = ['end', 'close']

const listen = (target: EventEmitter, eventName: string, cb: (...args: any[]) => void) => {
    target.on(eventName, cb)

    return () => target.off(eventName, cb)
}

type EventType = { next: boolean, complete: boolean, error: boolean }
type EventTypeLookup = { [event: string]: EventType }
const toEventTypeLookup = (next: string[], error: string[], complete: string[]): EventTypeLookup => {
    let lookup: EventTypeLookup = {}

    next.forEach((x) => { lookup[x] = { ...lookup[x], next: true } })
    error.forEach((x) => { lookup[x] = { ...lookup[x], error: true } })
    complete.forEach((x) => { lookup[x] = { ...lookup[x], complete: true } })

    return lookup
}


type Event = {
    event: string,
    args: any[],
}

type EventEmitter = {
    on: (event: string, callback: (...args: any[]) => void) => void,
    off: (event: string, callback: (...args: any[]) => void) => void,
}

export type FromEventEmitterOptions<T = Event> = {
    next?: string[],
    error?: string[],
    complete?: string[],
    nextSelector?: (event: string, args: any[]) => T,
}

export function fromEventEmitter<T = Event>(emitter: EventEmitter, options?: FromEventEmitterOptions<T>) {
    let opts = options || {}
    let selector = opts.nextSelector || defaultNextSelector

    let next = opts.next || []
    let error = opts.error || defaultErrorEvents
    let complete = opts.complete || defaultCompleteEvents

    let lookup = toEventTypeLookup(next, error, complete)
    let events = Object.keys(lookup)

    return new Observable<T>((obs) => {
        let callback = (event: string) => (...args: any[]) => {
            if (lookup[event]?.next) {
                let value = selector(event, args) as T
                obs.next(value)
            }
            if (lookup[event]?.error) {
                obs.error(...args)
            }
            if (lookup[event]?.complete) {
                obs.complete()
            }
        }

        let cleanup = events.map(x => listen(emitter, x, callback(x)))

        return () => cleanup.forEach(x => x())
    })
}
