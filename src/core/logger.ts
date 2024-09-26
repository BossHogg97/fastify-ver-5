import { default as Pino } from 'pino'
import { IpAddress } from '@/composables/useIpAddress'

import container from '@/core/diContainer'

const config = container.get('config.service')

// get local IP
const ip = IpAddress()

/***********************************************************
 * TARGETS
 **********************************************************/

const targetPinoPretty = {
  target: 'pino-pretty',
  level: config.logLevel || 'info',
  options: {
    translateTime: 'HH:MM:ss.l',
    ignore: 'pid,hostname',
    colorize: true
  }
}

const targetPinoLoki = {
  target: 'pino-loki',
  level: config.logLevel || 'info',
  options: {
    host: config.lokiServerUrl,
    labels: { container_name: '/authservice' }
  }
}

/***********************************************************
 * TRANSPORTS
 **********************************************************/

const transportDev = { targets: [targetPinoPretty] }

const transportProd = config.lokiServerUrl === '' ? { targets: [targetPinoPretty] } : { targets: [targetPinoPretty, targetPinoLoki] }

function getTransport4Environment() {
  switch (config.environment) {
    case 'development':
      return transportDev
    case 'production':
      return transportProd
    default:
      return transportDev
  }
}

// Set logger configuration
export const loggerConfig: any = {
  name: 'authservice',
  transport: getTransport4Environment(),
  redact: {
    paths: ['headers.authorization', 'encryptionKey', 'database'],
    remove: true,
    censor: '*****'
  },
  level: 'trace' // Set global log level across all transports
}

/**
 * Logging Guidelines
 *
 *
 * 1. Use the appropriate level with log.<level> (e.g. logger.info)
 *
 * Fatal - when the application crashes
 * Error - when logging an Error object
 * Warn - when logging something unexpected
 * Info - when logging information (most common use case)
 * Debug - when logging something that is temporarily added in for debugging
 * Trace - not currently used
 *
 *
 * 2. Log the entire Error object when logging an error and only add context via the second string parameter
 *
 * log.error(Error, "additional context")
 *
 * More info on best practices:
 * https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/
 */

export const logger = Pino(loggerConfig)

logger.debug(`The local IP is ${ip}`)
logger.debug(`Running on ${process.env.NODE_ENV} environment`)
