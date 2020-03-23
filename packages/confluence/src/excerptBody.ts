import { of, OperatorFunction } from 'rxjs'
import { mergeMap, map } from 'rxjs/operators'
import { log } from '@etlx/operators/core'
import { LoggerFactory } from '@etlx/operators/utils'
import { getTextContent } from '@etlx/operators/html/getTextContent'

import { ConfluencePageBody } from './types'
import { getPageBody } from './utils'

export type ExcerptBodyOptions = {
    logger?: LoggerFactory,
    maxLength?: number,
}

type Page = { body?: ConfluencePageBody }

export function excerptBody<T extends Page>(options?: ExcerptBodyOptions): OperatorFunction<T, T & { excerpt: string }> {
    let opts = options || {}

    return $ => $.pipe(
        log(opts.logger, 'Making page body excerpt', 'confluence'),
        mergeMap(page => of(getPageBody(page)).pipe(
            getTextContent(options),
            map(excerpt => ({ ...page, excerpt })),
        )),
        log(opts.logger, 'Page body excerpt added', 'confluence'),
    )
}
