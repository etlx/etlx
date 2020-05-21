import fs from 'fs'
import { toArray } from 'rxjs/operators'
import { join } from 'path'
import { rm } from './rm'

const recursive = { recursive: true }
const testdir = (...p: string[]) => join(__dirname, 'test', ...p)
const expectNotExists = (path: string) => expect(fs.existsSync(path)).toBeFalsy()

describe('rm', () => {
  it('remove directory', async () => {
    let path = testdir('remove-dir')
    await fs.promises.mkdir(path)

    let actual = await rm(path).pipe(toArray()).toPromise()
    let expected = [path]

    expect(actual).toEqual(expected)
    expectNotExists(path)
  })

  it('remove directory recursively', async () => {
    let path = testdir('remove-dir-rec/dir')
    await fs.promises.mkdir(path, recursive)

    let actual = await rm(path, recursive).pipe(toArray()).toPromise()
    let expected = [path]

    expect(actual).toEqual(expected)
    expectNotExists(path)
  })

  it('remove file', async () => {
    let path = testdir('remove-file.txt')
    await fs.promises.writeFile(path, '')

    let actual = await rm(path).pipe(toArray()).toPromise()
    let expected = [path]

    expect(actual).toEqual(expected)
    expectNotExists(path)
  })

  it('skip non existing path by default', async () => {
    let path = testdir('unknown-path')

    let actual = await rm(path).pipe(toArray()).toPromise()
    let expected = [path]

    expect(actual).toEqual(expected)
  })

  it('throw on non existing path', async () => {
    let path = testdir('unknown-path')

    let actual = rm(path, { throw: true }).toPromise()

    await expect(actual).rejects.toThrowError(`ENOENT: no such file or directory, lstat '${path}'`)
  })
})
