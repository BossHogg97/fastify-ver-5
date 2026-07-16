import fastifyPlugin from 'fastify-plugin'
import sensible from '@fastify/sensible'

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
export default fastifyPlugin<any>(async (fastify, opts) => {
  fastify.register(sensible, {
    ...opts
  })
  fastify.log.debug('Registered plugin sensible')
})
