import { OperatorFunction } from 'rxjs'
import { map, scan, takeWhile, takeLast, defaultIfEmpty } from 'rxjs/operators'
import { filterNode } from '../html'
import { JSDOM } from 'jsdom'

const inline = (x: string) =>
    x.replace(/(\n\r?)+/g, ' ').trim()

const join = (a: string, b: string) =>
    a.length === 0 ? b
    : b.length === 0 ? a
    : `${a} ${b}`

const lesser = (max: number) => (x: string) =>
    max <= 0 || x.length <= max

const truncate = (max: number, elipsis: string) => (x: string) =>
    max > 0 && x.length > max ? `${x.slice(0, max)}${elipsis}` : x

const isTextNode = (exclude: string[]) => (x: Node) => {
    if (x.nodeType !== x.TEXT_NODE || x.parentElement === null) {
        return false
    }

    return !exclude.includes(x.parentElement.tagName)
}

export type GetTextContentOptions = {
    maxLength?: number,
    excludeTags?: string[],
    elipsis?: string,
}
export function getTextContent(options?: GetTextContentOptions): OperatorFunction<string | JSDOM, string> {
    let opts = options || {}
    let max = opts.maxLength || 0
    let elipsis = opts.elipsis || ''
    let exclude = Array.isArray(opts.excludeTags)
        ? opts.excludeTags.map(x => x.toUpperCase())
        : []

    return $ => $.pipe(
        filterNode(isTextNode(exclude)),
        map(x => x.textContent || ''),
        map(inline),
        scan(join, ''),
        takeWhile(lesser(max), true),
        takeLast(1),
        map(truncate(max, elipsis)),
        defaultIfEmpty(''),
    )
}