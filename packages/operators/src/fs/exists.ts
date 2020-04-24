import fs from 'fs'
import { Observable } from 'rxjs'

export const exists = (filepath: string) => new Observable<boolean>((observer) => {
    fs.access(filepath, fs.constants.F_OK, (err) => {
        let exists = err === null

        observer.next(exists)
        observer.complete()
    })
})
