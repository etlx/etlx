import { Observable, of, OperatorFunction } from 'rxjs'
import { mergeMap, map, tap } from 'rxjs/operators'
import { pipeIf } from '@etlx/operators/core'
import { minify, stringifyBody, forEachAttribute, inlineImages } from '@etlx/operators/html'
import { LoggerFactory, getLogger } from '@etlx/operators/utils'
import { formatUrl } from '@etlx/operators/http'
import { ConfluencePageBody } from './types'
import { getPageBody, updateBody } from './utils'

export type NormalizeBodyOptions = {
    logger?: LoggerFactory,
    confluence: { host: string },
    inlineImages?: boolean,
}

type Page = { body?: ConfluencePageBody }

const cleanAttributes = (host: string) => ($: Observable<string>) => $.pipe(
    forEachAttribute((attr, parent) => {
        switch (attr.name) {
            case 'src':
            case 'href':
                attr.value = formatUrl(attr.value, { host, preserveAbsoluteUrls: true })
                return
            default:
                parent.removeAttribute(attr.name)
                return
        }
    }),
)

const cleanHtml = (opts: NormalizeBodyOptions) => ($: Observable<string>) => $.pipe(
    cleanAttributes(opts.confluence.host),
    pipeIf(opts.inlineImages, inlineImages(opts.confluence)),
    minify(),
)

export function normalizeBody<T extends Page>(opts: NormalizeBodyOptions): OperatorFunction<T, T> {
    const logger = getLogger('confluence', opts.logger)

    return $ => $.pipe(
        tap(() => logger.info('Normalizing page body')),
        mergeMap(page => of(getPageBody(page)).pipe(
            cleanHtml(opts),
            stringifyBody(),
            map(updateBody(page)),
        )),
        tap(() => logger.info('Page body normalized')),
    )
}