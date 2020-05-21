import { formatDocs } from './docs'

const inline = (str: string) => str
  .replace(/\n/g, ' ')
  .replace(/\s{2,}/g, ' ')
  .trim()

describe('formatDocs', () => {
  it('full docs', () => {
    let expected = '### test (`TEST`, `--test`) description * format: string * required: false * default: 42'

    let actual = formatDocs([{
      name: 'test',
      doc: 'description',
      format: 'string',
      default: '42',
      env: 'TEST',
      arg: 'test',
      parent: undefined,
    }])

    expect(inline(actual)).toEqual(expected)
  })

  it('empty', () => {
    let expected = ''

    let actual = formatDocs([{} as any])

    expect(inline(actual)).toEqual(expected)
  })

  it('emtpy strings', () => {
    let expected = '### test * format: * * required: false'

    let actual = formatDocs([{ name: 'test', arg: '', env: '', doc: '', format: '' }])

    expect(inline(actual)).toEqual(expected)
  })

  it('only name', () => {
    let expected = '### test * format: * * required: false'

    let actual = formatDocs([{ name: 'test' }])

    expect(inline(actual)).toEqual(expected)
  })

  it('doc', () => {
    let expected = '### test description * format: * * required: false'

    let actual = formatDocs([{ name: 'test', doc: 'description' }])

    expect(inline(actual)).toEqual(expected)
  })

  it('format', () => {
    let expected = '### test * format: string * required: false'

    let actual = formatDocs([{ name: 'test', format: 'string' }])

    expect(inline(actual)).toEqual(expected)
  })

  it('default', () => {
    let expected = '### test * format: * * required: false * default: 42'

    let actual = formatDocs([{ name: 'test', default: '42' }])

    expect(inline(actual)).toEqual(expected)
  })

  it('env', () => {
    let expected = '### test (`TEST`) * format: * * required: false'

    let actual = formatDocs([{ name: 'test', env: 'TEST' }])

    expect(inline(actual)).toEqual(expected)
  })

  it('arg', () => {
    let expected = '### test (`--test`) * format: * * required: false'

    let actual = formatDocs([{ name: 'test', arg: 'test' }])

    expect(inline(actual)).toEqual(expected)
  })
})
