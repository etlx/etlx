import { of, OperatorFunction } from 'rxjs'
import { mergeMap, map } from 'rxjs/operators'
import { log, LoggerConfig } from '@etlx/operators/log'
import { getTextContent } from '@etlx/operators/html/getTextContent'

import { ConfluencePageBody } from './types'
import { getPageBody } from './utils'

export type ExcerptBodyOptions = LoggerConfig & {
    maxLength?: number,
}

type Page = { body?: ConfluencePageBody }

export function excerptBody<T extends Page>(options?: ExcerptBodyOptions): OperatorFunction<T, T & { excerpt: string }> {
    let opts = options || {}

    return $ => $.pipe(
        log(opts, 'Making page body excerpt', 'confluence'),
        mergeMap(page => of(getPageBody(page)).pipe(
            getTextContent(options),
            map(excerpt => ({ ...page, excerpt })),
        )),
        log(opts, 'Page body excerpt added', 'confluence'),
    )
}
