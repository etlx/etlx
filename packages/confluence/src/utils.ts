import { OperatorFunction } from 'rxjs'
import { reduce } from 'rxjs/operators'
import { ConfluencePageBody, ConfluencePaginatedResponse, ConfluencePageBodyType } from './types'

type R<T = any> = ConfluencePaginatedResponse<T>
type Page = { body?: ConfluencePageBody }

export function inferBodyRepresentation(page: Page): ConfluencePageBodyType | undefined {
    if (page.body === undefined) {
        return undefined
    }
    if (page.body.view !== undefined) {
        return 'view'
    }
    if (page.body.export_view !== undefined) {
        return 'export_view'
    }
    if (page.body.anonymous_export_view !== undefined) {
        return 'anonymous_export_view'
    }
    if (page.body.storage !== undefined) {
        return 'storage'
    }
    if (page.body.editor !== undefined) {
        return 'editor'
    }

    return undefined
}

export function getPageBody(page: Page): string {
    const field = inferBodyRepresentation(page)
    if (field === undefined) {
        return ''
    }

    const body =  page.body![field]

    return body === undefined ? '' : body.value
}

export const updateBody = <T extends Page>(page: T) => (value: string) => {
    const representation = inferBodyRepresentation(page)

    return representation === undefined ? page : {
        ...page,
        body: { [representation]: { value, representation } },
    }
}

const sumPages = <T>(a: R<T>, b: R<T>): R<T> => ({
    results: Array.isArray(a.results) ? [...a.results, ...b.results] : b.results,
    start: b.start < a.start ? b.start : a.start,
    size: 0,
    limit: b.limit,
})

export function concatPages<T>(): OperatorFunction<R<T>, R<T>> {
    let emptyPage = { results: [], start: 0, size: 0, limit: 0 }

    return $ => $.pipe(reduce(sumPages, emptyPage))
}