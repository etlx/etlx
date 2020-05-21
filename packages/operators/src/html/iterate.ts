import { OperatorFunction, from } from 'rxjs'
import { map, mergeMap, filter } from 'rxjs/operators'
import { JSDOM } from 'jsdom'
import { getDom, isHtmlElement, forEach, toArray } from './utils'
import { notNullOrUndefined, flatten } from '../@internal/utils'

type HtmlOperator = OperatorFunction<JSDOM | string, JSDOM>

export const forEachAttribute = (fn: (attr: Attr, parent: HTMLElement) => void): HtmlOperator => stream => stream.pipe(
    map((input) => {
        let dom = getDom(input)

        let traverseTree = (node: Node) => {
            if (isHtmlElement(node)) {
                forEach(node.attributes, x => fn(x, node))
            }

            node.childNodes.forEach(traverseTree)
        }

        traverseTree(dom.window.document)

        return dom
    }),
)

export const forEachNode = (fn: (x: Node) => void): HtmlOperator => stream => stream.pipe(
    map((input) => {
        let dom = getDom(input)
        let { body } = dom.window.document

        let traverseTree = (x: Node) => {
            fn(x)
            x.childNodes.forEach(traverseTree)
        }

        traverseTree(body)

        return dom
    }),
)

export function mapNode<T>(fn: (x: Node) => T): OperatorFunction<JSDOM | string, T> {
    return stream => stream.pipe(
        mergeMap((input) => {
            let dom = getDom(input)
            let { body } = dom.window.document

            let mapNodeResursive = (x: Node): T[] => {
                let children = toArray(x.childNodes)

                let result = fn(x)
                let childResults = flatten(children.map(mapNodeResursive))

                return [result, ...childResults]
            }

            return from(mapNodeResursive(body))
        }),
    )
}


export function filterNode<T extends Node = Node>(
    predicate: ((node: Node) => node is T) | ((node: Node) => boolean),
): OperatorFunction<JSDOM | string, T> {
    return stream => stream.pipe(
        mapNode(x => predicate(x) ? x : undefined),
        filter(notNullOrUndefined),
    )
}
