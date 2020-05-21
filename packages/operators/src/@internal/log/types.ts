export type LogLevel = 'debug' | 'info' | 'warn' | 'error'
export type LoggerInternal = (message: any, level?: LogLevel, name?: string) => void
export type LoggerConfig = { logger?: LoggerInternal }

type LogFunction = (msg: string | Error) => void
export type Logger = {
  debug: LogFunction,
  info: LogFunction,
  warn: LogFunction,
  error: LogFunction,
}
