import fastifyPlugin from 'fastify-plugin'
import mongo from '@fastify/mongodb'

/**
 * This plugins adds MongoDB connection plugin
 *
 * @see https://github.com/fastify/fastify-mongodb
 */
export default fastifyPlugin(async function (fastify: any, options: { config: any }) {
  void fastify.register(mongo, {
    // force to close the mongodb connection when app stopped
    forceClose: true,
    url: options.config.MONGO_URL,
    database: options.config.MONGO_DATABASE
  })

  fastify.log.debug('Registered plugin mongo')
})
