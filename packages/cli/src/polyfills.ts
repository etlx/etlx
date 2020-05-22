const fetch = require('node-fetch')
const ac = require('abort-controller')

const merge = (global: any, patch: any) => {
  Object.entries(patch).forEach(([key, val]) => {
    if (!(key in global)) {
      // eslint-disable-next-line no-param-reassign
      global[key] = val
    }
  })
}


function fetchPolyfill() {
  return {
    fetch,
    Response: fetch.Response,
    Headers: fetch.Headers,
    Request: fetch.Request,
    AbortController: ac.AbortController,
    AbortSignal: ac.AbortSignal,
  }
}

const atob = (str: string) => Buffer.from(str, 'base64').toString('binary')
const btoa = (str: string) => Buffer.from(str, 'binary').toString('base64')

export function polyfill(global: any) {
  let patch = {
    atob,
    btoa,
    ...fetchPolyfill(),
  }

  merge(global, patch)
}
