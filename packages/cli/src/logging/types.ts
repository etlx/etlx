export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export type Logger = (message: any, level?: LogLevel, name?: string) => void
export type LoggerInternal = (message: string, level: LogLevel, name: string) => void

export type LoggingOptions = {
  level?: LogLevel | 'silent',
  raw?: boolean,
  components?: {
    [name: string]: { level?: LogLevel },
  },
}

export type LoggingConfig = {
  logging?: LoggingOptions,
  logger: Logger,
}
export const loggingConfigSchema = {
  logging: {
    level: {
      doc: 'Minimum level of log message to be printed. Possible values are: debug, info, warn, error, silent',
      default: 'info',
      env: 'LOG_LEVEL',
      arg: 'log',
      format: '*',
    },
    raw: {
      doc: 'If set, logs are printed in Pino format suitable for machine processing',
      default: false,
      env: 'LOG_RAW',
      arg: 'log-raw',
      format: Boolean,
    },
  },
}
