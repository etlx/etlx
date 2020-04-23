import { forEachNode, mapNode, filterNode } from './iterate'
import { of } from 'rxjs'
import { toArray } from 'rxjs/operators'
import { notNullOrUndefined } from '../@internal/utils'
import { isTag } from './utils'
import { wrapHtml, inline } from '../@internal/testing/html'


describe('forEachNode', () => {
    it('can visit node', async () => {
        const html = '<div><a href="#">link</a></div>'

        const fn = (x: Node) => {
            if (x.nodeName === 'A') {
                x.parentNode!.removeChild(x)
            }
        }

        const actual = await forEachNode(fn)(of(html)).toPromise()

        expect(actual.serialize()).toEqual(wrapHtml('<div></div>'))
    })

    it('can modify node', async () => {
        const html = `
        <div >
            <a href="#"> link </a>

        </div>`
        const expected = '<div><a href="#"> link </a></div>'

        const fn = (node: Node) => {
            if (node.nodeType === node.TEXT_NODE) {
                if (node.nodeValue === null) {
                    return
                }

                const text = inline(node.nodeValue)
                node.nodeValue = text === ' ' ? null : text
            }
        }

        const actual = await forEachNode(fn)(of(html)).toPromise()

        expect(actual.serialize()).toEqual(wrapHtml(expected))
    })
})

describe('mapNodes', () => {
    it('can map node', async () => {
        const html = '<div> <p>One</p> <p>Two<b>Three</b></p><br/> </div>'

        const fn = (x: Node) => {
            if (x.nodeName === 'P') {
                const element = x as HTMLElement
                return element.innerHTML
            }
        }

        const actual = await mapNode(fn)(of(html)).pipe(toArray()).toPromise()

        expect(actual.filter(notNullOrUndefined).join('|')).toEqual('One|Two<b>Three</b>')
    })
})

describe('filterNodes', () => {
    it('can filter node', async () => {
        const html = '<div> <p>One</p> <p>Two<b>Three</b></p><br/> </div>'

        const actual = await filterNode(isTag('b'))(of(html)).pipe(toArray()).toPromise()

        expect(actual).toHaveLength(1)
        expect(actual[0].innerHTML).toEqual('Three')
    })
})
