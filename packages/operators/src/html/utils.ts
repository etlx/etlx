import { JSDOM } from 'jsdom'

export type DOMCollection<T> = { item: (i: number) => T | null, length: number }

export const getDom = (input: string | any) => {
    if (typeof input === 'string') {
        return new JSDOM(input)
    }
    if (input instanceof JSDOM) {
        return input
    }

    throw new Error('Input expected to be string or JSDOM')
}

export function toArray<T>(source: DOMCollection<T>): T[] {
    const result = new Array(source.length)
    for (let i = 0; i < source.length; i++) {
        result[i] = source.item(i)
    }

    return result
}

export function forEach<T>(source: DOMCollection<T>, fn: (x: T, i: number) => void) {
    let length = source.length
    let index = 0

    while (true) {
        const item = source.item(index)
        if (item === null) {
            break
        }

        fn(item, index)

        // if element was removed from the collection
        // index should stay the same
        if (source.length >= length) {
            index++
        }
        length = source.length
    }
}

export function isHtmlElement(node: Node): node is HTMLElement {
    return node.nodeType === node.ELEMENT_NODE
}

export function isTag(tagName: string) {
    return (node: Node): node is HTMLElement => {
        if (node.nodeName === tagName.toUpperCase()) {
            return isHtmlElement(node)
        } else {
            return false
        }
    }
}
