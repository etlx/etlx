import { basicCredentials, authBasic, formatUrl } from './utils'

describe('http/encodeBasicCredentials', () => {
  it('encode basic credentials', () => {
    let actual = basicCredentials('username', 'password')

    let expected = 'Basic dXNlcm5hbWU6cGFzc3dvcmQ='

    expect(actual).toEqual(expected)
  })

  it('create auth header', () => {
    let actual = authBasic({ username: 'username', password: 'password' })

    let expected = { Authorization: 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=' }

    expect(actual).toEqual(expected)
  })
})


describe('http/formatUrl', () => {
  it('format relative url', () => {
    let actual = formatUrl('path')

    let expected = '/path'

    expect(actual).toEqual(expected)
  })

  it('resolve relative url', () => {
    let actual = formatUrl('path', { host: 'http://example.com' })

    let expected = 'http://example.com/path'

    expect(actual).toEqual(expected)
  })

  it('resolve origin only', () => {
    let actual = formatUrl('path', { host: 'https://example.com/test?q=123' })

    let expected = 'https://example.com/path'

    expect(actual).toEqual(expected)
  })


  it('format absolute url', () => {
    let actual = formatUrl('http://example.com/path')

    let expected = 'http://example.com/path'

    expect(actual).toEqual(expected)
  })

  it('rebase absolute url', () => {
    let actual = formatUrl('http://example.com/path', { host: 'http://test.com' })

    let expected = 'http://test.com/path'

    expect(actual).toEqual(expected)
  })

  it('preserve absolute url', () => {
    let actual = formatUrl('http://example.com/path', { host: 'http://test.com', preserveAbsoluteUrls: true })

    let expected = 'http://example.com/path'

    expect(actual).toEqual(expected)
  })

  it('keep url credentials', () => {
    let actual = formatUrl('http://user:password@example.com')

    let expected = 'http://user:password@example.com/'

    expect(actual).toEqual(expected)
  })

  it('can rebase absolute url with credentials', () => {
    let actual = formatUrl('http://user:password@example.com', { host: 'http://test.com' })

    let expected = 'http://user:password@test.com/'

    expect(actual).toEqual(expected)
  })

  it('can rebase absolute url to credentials', () => {
    let actual = formatUrl('http://usr:pwd@example.com', { host: 'http://user:password@test.com' })

    let expected = 'http://user:password@test.com/'

    expect(actual).toEqual(expected)
  })

  it('format query params', () => {
    let actual = formatUrl('http://example.com', {
      query: {
        a: 1,
        b: 'two',
        c: false,
        d: undefined,
        e: null,
      },
    })

    let expected = 'http://example.com/?a=1&b=two&c=false'

    expect(actual).toEqual(expected)
  })

  it('preserve hash', () => {
    let actual = formatUrl('path#123', { host: 'http://example.com', query: { q: 'test' } })

    let expected = 'http://example.com/path?q=test#123'

    expect(actual).toEqual(expected)
  })
})
