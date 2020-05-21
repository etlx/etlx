import { of, interval, concat } from 'rxjs'
import { toArray, take, map } from 'rxjs/operators'
import stream from 'stream'
import { streamInto } from './streamInto'

class MemoryStream extends stream.Writable {
  private buffer: Buffer

  private delay: number

  constructor(options?: stream.WritableOptions & { delay?: number }) {
    super(options)

    let opts = options || {}

    this.delay = opts.delay || 0
    this.buffer = Buffer.from('')
  }

  // eslint-disable-next-line no-underscore-dangle
  public _write(chunk: any, encoding: string, callback: (error?: Error | null) => void) {
    this.writeAsync(chunk, encoding, callback)
  }

  public writeAsync(chunk: any, encoding: string, callback: (error?: Error | null) => void) {
    setTimeout(
      () => this.writeSync(chunk, encoding, callback),
      this.delay,
    )
  }

  public writeSync(chunk: any, encoding: string, callback: (error?: Error | null) => void) {
    this.buffer = Buffer.isBuffer(chunk)
      ? Buffer.concat([this.buffer, chunk])
      : Buffer.from(chunk, encoding as any)

    callback()
  }

  public toString() {
    return this.buffer.toString('utf-8')
  }
}

describe('streamInto', () => {
  it('can stream', async () => {
    let writable = new MemoryStream()

    let expected = ['42']
    let actual = await of('42').pipe(streamInto(writable), toArray()).toPromise()

    expect(actual).toEqual(expected)
    expect(writable.toString()).toEqual('42')
  })

  it('can stream in order', async () => {
    let writable = new MemoryStream({ delay: 10 })

    let expected = '123456789'

    let $1 = interval(10).pipe(map(x => `${x + 1}`), take(3))
    let $2 = interval(11).pipe(map(x => `${x + 4}`), take(3))
    let $3 = interval(12).pipe(map(x => `${x + 7}`), take(3))
    let $ = concat($1, $2, $3)

    await $.pipe(streamInto(writable)).toPromise()

    expect(writable.toString()).toEqual(expected)
  })
})
