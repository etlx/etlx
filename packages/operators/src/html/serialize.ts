import { OperatorFunction } from 'rxjs'
import { JSDOM } from 'jsdom'
import { map } from 'rxjs/operators'

export const serialize = (): OperatorFunction<JSDOM, string> => stream => stream.pipe(
  map(x => x.serialize()),
)

export const stringifyBody = (): OperatorFunction<JSDOM, string> => stream => stream.pipe(
  map((dom) => {
    let { body } = dom.window.document

    if (body === null) {
      return dom.window.document.textContent || ''
    } else {
      return body.innerHTML
    }
  }),
)
