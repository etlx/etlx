import fs from 'fs'
import { Observable, of } from 'rxjs'
import { catchError, mapTo } from 'rxjs/operators'
import { access } from './bindings'

export const exists = (path: fs.PathLike): Observable<boolean> => access(path, fs.constants.F_OK).pipe(
    mapTo(true),
    catchError(() => of(false)),
)
