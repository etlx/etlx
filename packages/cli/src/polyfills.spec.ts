import { polyfill } from './polyfills'

describe('polyfills', () => {
  it('can add all polyfills successfuly', () => {
    let actual = () => polyfill({})
    expect(actual).not.toThrow()
  })

  it('add fetch polyfill', () => {
    let props = ['fetch', 'Request', 'Response', 'Headers', 'AbortController', 'AbortSignal']

    let actual = {}
    polyfill(actual)

    props.forEach((expected) => {
      expect(actual).toHaveProperty(expected)
    })
  })

  it('add atob/btoa polyfills', () => {
    let actual = {}
    polyfill(actual)

    expect(actual).toHaveProperty('atob')
    expect(actual).toHaveProperty('btoa')
  })
})
