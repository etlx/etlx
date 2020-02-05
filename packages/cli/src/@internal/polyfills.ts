import fetch from 'node-fetch'
const { XMLHttpRequest } = require('xhr2')

const atob = (str: string) => Buffer.from(str, 'base64').toString('binary')
const btoa = (str: string) => Buffer.from(str, 'binary').toString('base64')

export function polyfill(global: any) {
    global.atob = atob
    global.btoa = btoa
    global.fetch = fetch
    global.XMLHttpRequest = XMLHttpRequest
}