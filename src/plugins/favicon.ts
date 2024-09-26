import fp from 'fastify-plugin'
import favicon from 'fastify-favicon'

/**
 * With this plugin, Fastify will have a route
 * configured for /favicon.ico requests.
 *
 * @see https://github.com/smartiniOnGitHub/fastify-favicon
 */
export default fp(async (fastify) => {
  await fastify.register(favicon)
  fastify.log.debug('Registered plugin favicon')
})
