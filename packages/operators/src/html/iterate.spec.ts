import { of } from 'rxjs'
import { toArray } from 'rxjs/operators'
import { forEachNode, mapNode, filterNode } from './iterate'
import { notNullOrUndefined } from '../@internal/utils'
import { isTag } from './utils'
import { wrapHtml, inline } from '../@internal/testing/html'


describe('forEachNode', () => {
    it('can visit node', async () => {
        let html = '<div><a href="#">link</a></div>'

        let fn = (x: Node) => {
            if (x.nodeName === 'A') {
                x.parentNode!.removeChild(x)
            }
        }

        let actual = await forEachNode(fn)(of(html)).toPromise()

        expect(actual.serialize()).toEqual(wrapHtml('<div></div>'))
    })

    it('can modify node', async () => {
        let html = `
        <div >
            <a href="#"> link </a>

        </div>`
        let expected = '<div><a href="#"> link </a></div>'

        let fn = (node: Node) => {
            if (node.nodeType === node.TEXT_NODE) {
                if (node.nodeValue === null) {
                    return
                }

                let text = inline(node.nodeValue)

                // eslint-disable-next-line no-param-reassign
                node.nodeValue = text === ' ' ? null : text
            }
        }

        let actual = await forEachNode(fn)(of(html)).toPromise()

        expect(actual.serialize()).toEqual(wrapHtml(expected))
    })
})

describe('mapNodes', () => {
    it('can map node', async () => {
        let html = '<div> <p>One</p> <p>Two<b>Three</b></p><br/> </div>'

        let fn = (x: Node) => {
            if (x.nodeName === 'P') {
                let element = x as HTMLElement
                return element.innerHTML
            }
            return undefined
        }

        let actual = await mapNode(fn)(of(html)).pipe(toArray()).toPromise()

        expect(actual.filter(notNullOrUndefined).join('|')).toEqual('One|Two<b>Three</b>')
    })
})

describe('filterNodes', () => {
    it('can filter node', async () => {
        let html = '<div> <p>One</p> <p>Two<b>Three</b></p><br/> </div>'

        let actual = await filterNode(isTag('b'))(of(html)).pipe(toArray()).toPromise()

        expect(actual).toHaveLength(1)
        expect(actual[0].innerHTML).toEqual('Three')
    })
})
