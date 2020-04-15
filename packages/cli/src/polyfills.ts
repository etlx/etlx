const atob = (str: string) => Buffer.from(str, 'base64').toString('binary')
const btoa = (str: string) => Buffer.from(str, 'binary').toString('base64')

function polyfillFetch(global: any) {
    const fetch = require('node-fetch')
    const ac = require('abort-controller')

    global.fetch = fetch
    global.Response = fetch.Response
    global.Headers = fetch.Headers
    global.Request = fetch.Request
    global.AbortController = ac.AbortController
    global.AbortSignal = ac.AbortSignal
}

export function polyfill(global: any) {
    global.atob = atob
    global.btoa = btoa

    polyfillFetch(global)
}