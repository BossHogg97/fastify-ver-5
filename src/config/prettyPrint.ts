import { FastifyBaseLogger } from 'fastify'

/**
 * Interface for configuration data object
 */
interface ConfigData {
  [key: string]: any
}

/**
 * A utility class for pretty printing configuration values
 * using a Fastify logger instance
 */
export class PrettyPrint {
  private logger: FastifyBaseLogger
  private config: ConfigData

  /**
   * Creates a new PrettyPrint instance
   * @param logger A Fastify logger instance
   * @param config The configuration data to print
   */
  constructor(logger: FastifyBaseLogger, config: ConfigData) {
    this.logger = logger
    this.config = config
  }

  /**
   * Prints config values in a readable format, filtering sensitive data.
   * Only logs in development environment to prevent sensitive data exposure.
   */
  prettyPrint(): void {
    // Only log configuration in development environment
    if (this.config.NODE_ENV !== 'development') {
      return
    }

    const maxKeyLength = Math.max(...Object.keys(this.config).map((key) => key.length))

    // Filter sensitive configuration values
    const safeConfig = Object.fromEntries(
      Object.entries(this.config).map(([key, value]) => {
        const sensitiveKeys = ['secret', 'key', 'password', 'token', 'auth']
        const isSensitive = sensitiveKeys.some((sensitiveKey) => key.toLowerCase().includes(sensitiveKey))
        return [key, isSensitive ? '[REDACTED]' : value]
      })
    )

    this.logger.debug('Config Values:')
    this.logger.debug('-'.repeat(40))
    for (const key of Object.keys(safeConfig).sort()) {
      this.logger.debug(`${key.padEnd(maxKeyLength)} : ${safeConfig[key]}`)
    }
  }
}
