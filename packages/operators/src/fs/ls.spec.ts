import { toArray, map } from 'rxjs/operators'
import { ls } from './ls'

const testdir = `${__dirname}/test/ls`

describe('ls', () => {
  it('can list', async () => {
    let $ = ls(testdir)

    let actual = await $.pipe(map(x => x.base), toArray()).toPromise()

    let expected = ['1', '2', 'test.txt']

    expect(actual).toEqual(expected)
  })

  it('can list recursively', async () => {
    let $ = ls(testdir, { recursive: true })

    let actual = await $.pipe(map(x => x.base), toArray()).toPromise()

    let expected = ['1', '2', 'test.txt', '1.2', '1.txt', '2.txt', '1.2.txt']

    expect(actual).toEqual(expected)
  })

  it('return input on file path', async () => {
    let $ = ls(`${testdir}/test.txt`)

    let actual = await $.pipe(map(x => x.base), toArray()).toPromise()

    let expected = ['test.txt']

    expect(actual).toEqual(expected)
  })

  it('throw unexisting file', async () => {
    let $ = ls('./unknow/dir')

    let actual = $.pipe(toArray()).toPromise()

    await expect(actual).rejects.toThrowError("ENOENT: no such file or directory, lstat './unknow/dir'")
  })

  it('throw on null', () => {
    let actual = () => ls(null as any)

    expect(actual).toThrowError('basePath must be string')
  })

  it('throw on undefined', () => {
    let actual = () => ls(undefined as any)

    expect(actual).toThrowError('basePath must be string')
  })
})
