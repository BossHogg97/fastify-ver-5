import Fastify from 'fastify'
import autoLoad from '@fastify/autoload'
import { loggerConfig } from '@/core/logger'
import closeWithGrace from 'close-with-grace'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

import container from '@/core/diContainer'

const config = container.get('config.service')

// Normally these names are defined by Node.js.
// But when "type" is set to "module" in package.json, these go away.
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * Instantiate Fastify with some option configuration's
 */
const fastify = Fastify({
  logger: loggerConfig,
  disableRequestLogging: true,
  pluginTimeout: 50000
})

/**
 * Register all plugins and routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */
fastify
  .register(autoLoad, {
    dir: join(__dirname, 'plugins'),
    forceESM: true // If set to 'true' it always use await import to load plugins or hooks
  })
  .register(autoLoad, {
    dir: join(__dirname, 'routes'),
    forceESM: true, // If set to 'true' it always use await import to load plugins or hooks
    options: {
      prefix: config.environment === 'development' ? config.proxyPath : '/'
    }
  })

// Delay is the number of milliseconds for the graceful close to finish
closeWithGrace({ delay: 500 }, async function (opts: any) {
  if (opts.err) {
    fastify.log.error(opts.err)
  }
  await fastify.close()
})

fastify.setErrorHandler((error: Error, request, reply) => {
  fastify.log.warn('setErrorHandler', request, error)
  reply.status(500).send(error)
})

try {
  fastify.log.info(`Server starting ...`)
  fastify.listen({ port: Number(config.port), host: config.host || '0.0.0.0' })

  fastify.log.info(`======================= FASTIFY BOILERPLATE IS READY =======================`)
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}
