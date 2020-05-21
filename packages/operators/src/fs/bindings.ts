import { bindNodeCallback, Observable } from 'rxjs'
import fs from 'fs'


type Lstat = (path: fs.PathLike) => Observable<fs.Stats>
export const lstat: Lstat = bindNodeCallback(fs.lstat)

type ReadDir = (path: string) => Observable<string[]>
export const readdir: ReadDir = bindNodeCallback(fs.readdir)

type Mkdir = (path: string, opts?: fs.MakeDirectoryOptions) => Observable<void>
export const mkdir: Mkdir = bindNodeCallback(fs.mkdir)

type Cp = (source: string, target: string) => Observable<void>
export const cp: Cp = bindNodeCallback(fs.copyFile)

type Mv = (source: string, target: string) => Observable<void>
export const mv: Mv = bindNodeCallback(fs.rename)

type RmDir = (path: fs.PathLike, opts?: fs.RmDirOptions) => Observable<void>
export const rmdir: RmDir = bindNodeCallback(fs.rmdir)

type Unlink = (path: fs.PathLike) => Observable<void>
export const unlink: Unlink = bindNodeCallback(fs.unlink)


type ReadFileOptions = {
  encoding?: string,
  flag?: string | undefined;
}
type ReadFile = (path: fs.PathLike, opts?: ReadFileOptions) => Observable<string | Buffer>
export const readFile: ReadFile = bindNodeCallback(fs.readFile)

type WriteFile = (path: fs.PathLike, data: any, opts?: fs.WriteFileOptions) => Observable<void>
export const writeFile: WriteFile = bindNodeCallback(fs.writeFile)

type Access = (path: fs.PathLike, mode?: number) => Observable<void>
export const access: Access = bindNodeCallback(fs.access)
