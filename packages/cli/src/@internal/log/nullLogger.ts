import { Logger } from '.'

const emptyFn = () => {}
const nullLogger: Logger = {
    debug: emptyFn,
    info: emptyFn,
    warn: emptyFn,
    error: emptyFn,
}

export const nullLoggerFactory = () => nullLogger