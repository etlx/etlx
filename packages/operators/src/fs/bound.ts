import { bindNodeCallback, Observable } from 'rxjs'
import fs from 'fs'

type NodeCallback<T extends any[] = []> = (e: any, ...args: T) => void

type Lstat = (path: fs.PathLike) => Observable<fs.Stats>
export const lstat: Lstat = bindNodeCallback(fs.lstat)

type ReadDir = (path: string) => Observable<string[]>
export const readdir: ReadDir = bindNodeCallback(
    (p: fs.PathLike, cb: NodeCallback<[string[]]>) => fs.readdir(p, cb),
)

type Mkdir = (path: string, opts?: fs.MakeDirectoryOptions) => Observable<void>
export const mkdir: Mkdir = bindNodeCallback(
    (p: fs.PathLike, o: fs.MakeDirectoryOptions, cb: NodeCallback) => fs.mkdir(p, o, cb),
)

type Cp = (source: string, target: string) => Observable<void>
export const cp: Cp = bindNodeCallback(
    (p1: fs.PathLike, p2: fs.PathLike, cb: NodeCallback) => fs.copyFile(p1, p2, cb),
)

type Mv = (source: string, target: string) => Observable<void>
export const mv: Mv = bindNodeCallback(
    (p1: fs.PathLike, p2: fs.PathLike, cb: NodeCallback) => fs.rename(p1, p2, cb),
)