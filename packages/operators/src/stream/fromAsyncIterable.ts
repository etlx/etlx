import { Observable } from "rxjs"

export function fromAsyncIterable<T = any>(readable: AsyncIterable<T>): Observable<T> {
    let iterate = createtIterator(readable)

    return new Observable<T>((obs) => {
        let next = obs.next.bind(obs)
        let complete = obs.complete.bind(obs)
        let error = obs.error.bind(obs)

        iterate(next).then(complete).catch(error)
    })
}

function createtIterator<T>(readable: AsyncIterable<T>) {
    return async (f: (x: T) => void) => {
        for await (let item of readable) {
            f(item)
        }
    }
}