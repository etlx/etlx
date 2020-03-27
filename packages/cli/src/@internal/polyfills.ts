const atob = (str: string) => Buffer.from(str, 'base64').toString('binary')
const btoa = (str: string) => Buffer.from(str, 'binary').toString('base64')

function polyfillFetch(global: any) {
    const fetch = require('node-fetch')

    global.fetch = fetch
    global.Response = fetch.Response
    global.Headers = fetch.Headers
    global.Request = fetch.Request

    require('abort-controller/polyfill')
}

export function polyfill(global: any) {
    global.atob = atob
    global.btoa = btoa
    global.fetch = fetch

    polyfillFetch(global)
}