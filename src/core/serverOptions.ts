import { FastifyServerOptions } from 'fastify'
import { loggerManager } from './loggerManager'

export function createServerOptions(): FastifyServerOptions {
  return {
    disableRequestLogging: true,
    routerOptions: {
      ignoreTrailingSlash: true,
      ignoreDuplicateSlashes: true
    },
    logger: loggerManager.getLoggerOptions(),
    bodyLimit: 50 * 1024 * 1024 // 50 MB
  }
}
