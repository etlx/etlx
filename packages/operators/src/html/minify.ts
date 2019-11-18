import { forEach, getDom } from './utils'
import { map } from 'rxjs/internal/operators/map'
import { OperatorFunction } from 'rxjs'
import { JSDOM } from 'jsdom'


export const minify = (): OperatorFunction<JSDOM | string, JSDOM> => stream => stream.pipe(
    map((input) => {
        const dom = getDom(input)

        minifyHtml(dom.window.document)

        return dom
    }),
)

const trimLeft = (str: string) => str
    .replace(/^[\s\r\n\t\f]*/g, '')

const trimRight = (str: string) => str
    .replace(/[\s\r\n\t\f]*$/g, '')

const trimContent = (str: string) => str
    .replace(/[\r\n\t\f]/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()

const trim = (str: string) => {
    switch (str.length) {
        case 0: return str
        case 1: return trimLeft(str)
        default: return trimContent(trimRight(trimLeft(str)))
    }
}

const processTextNode = (node: Node) => {
    if (node.nodeValue === null) {
        return null
    }

    const text = trim(node.nodeValue)

    node.nodeValue = text.length === 0 ? null : text
}

const handleNodeRecursive = (node: Node) => {
    if (node.nodeType === node.TEXT_NODE) {
        processTextNode(node)
    } else {
        forEach(node.childNodes, handleNodeRecursive)
    }
}

export function minifyHtml(document: Document) {
    handleNodeRecursive(document)

    return document
}