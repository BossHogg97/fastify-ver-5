// core/loggerManager.ts
import { default as Pino, LoggerOptions } from 'pino'

type LoggerConfig = {
  PROJECT_NAME: string
  NODE_ENV: string
  LOG_LEVEL: string
}

class LoggerManager {
  private static instance: LoggerManager | null = null
  private _logger: Pino.Logger | null = null
  private _loggerOptions: LoggerOptions | null = null

  private constructor() {}

  static getInstance(): LoggerManager {
    if (!LoggerManager.instance) {
      LoggerManager.instance = new LoggerManager()
    }
    return LoggerManager.instance
  }

  /**
   * Initialize the logger with configuration
   */
  initialize(config: any): void {
    if (this._logger) {
      console.warn('Logger already initialized')
      return
    }

    this._loggerOptions = {
      level: config.LOG_LEVEL,
      base: {
        Application: config.PROJECT_NAME
      },
      serializers: {
        req: (request: any) => ({
          method: request.method,
          url: request.url,
          // headers: request.headers, // !! Don't enable on production. Is a violation of GDPR laws
          params: request.params,
          query: request.query,
          id: request.id
        }),
        res: (reply: any) => ({
          statusCode: reply.statusCode,
          headers: reply.headers
        })
      },
      transport: {
        targets: this.getTransports(config)
      },
      redact: {
        paths: ['headers.authorization', 'ENCRYPTION_KEY', 'MONGO_PASS', 'token', 'CENT_API_KEY'],
        remove: false,
        censor: '*****'
      }
    }

    this._logger = Pino(this._loggerOptions)
  }

  /**
   * Get the logger instance
   */
  getLogger(): Pino.Logger {
    if (!this._logger) {
      throw new Error('Logger not initialized. Call initialize() first.')
    }
    return this._logger
  }

  /**
   * Get the logger options (useful for Fastify configuration)
   */
  getLoggerOptions(): LoggerOptions {
    if (!this._loggerOptions) {
      throw new Error('Logger not initialized. Call initialize() first.')
    }
    return this._loggerOptions
  }

  /**
   * Check if logger is initialized
   */
  isInitialized(): boolean {
    return this._logger !== null
  }

  /**
   * Build transports array based on environment
   */
  private getTransports(config: LoggerConfig) {
    // Define array of transports
    const targets: any[] = []

    const pinoPrettyTransport = {
      target: 'pino-pretty',
      options: {
        colorize: true,
        ignore: 'time,pid,hostname,reqId,source'
      }
    }

    const victoriaTransport = {
      target: 'pino-opentelemetry-transport',
      options: {
        resourceAttributes: {
          'service.name': config.PROJECT_NAME
        }
      }
    }

    // Add victoria log transport
    targets.push(victoriaTransport)

    // Add console logger
    targets.push(pinoPrettyTransport)

    return targets
  }
}

// Export singleton instance getter
export const loggerManager = LoggerManager.getInstance()

// Convenience function to get logger
export const getLogger = () => loggerManager.getLogger()
