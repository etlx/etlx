import pino from 'pino'
import { LoggingOptions, LoggerInternal } from './types'


export const pinoLogger = (opts: LoggingOptions): LoggerInternal => {
  let pretty = opts.raw !== true
  let prettyOpts: pino.PrettyOptions = {
    translateTime: 'HH:mm:ss',
    ignore: 'pid,hostname',
  }
  let options: pino.LoggerOptions = {
    prettyPrint: pretty ? prettyOpts : false,
    level: opts.level || 'info',
    base: null,
  }

  return fromPino(pino(options))
}

function fromPino(logger: pino.Logger): LoggerInternal {
  return (msg, level, name) => {
    let child = logger.child({ name })

    switch (level) {
      case 'debug':
        child.debug(msg)
        break
      case 'warn':
        child.warn(msg)
        break
      case 'error':
        child.error(msg)
        break
      default:
        child.info(msg)
        break
    }
  }
}
