import { polyfill } from './@internal/polyfills'

polyfill(global)

export { EtlPipe } from './@internal/pipe'
export { etlx } from './@internal/builder/etlx'
