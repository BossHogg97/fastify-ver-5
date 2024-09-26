import fp from 'fastify-plugin'
import cors from '@fastify/cors'

/**
 * This plugin enables the use of CORS in a Fastify application.
 *
 * @see https://www.npmjs.com/package/@fastify/cors
 */
export default fp(async (fastify, opts) => {
  void fastify.register(cors, { ...opts })
  fastify.log.debug('Registered plugin cors')
})
