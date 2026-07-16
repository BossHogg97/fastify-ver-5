import fastifyPlugin from 'fastify-plugin'
import fastifyRabbitMQ from 'fastify-rabbitmq'

export default fastifyPlugin(async (fastify: any, opts: any) => {
  await fastify.register(fastifyRabbitMQ, opts)
  fastify.log.debug('Registered plugin fastify-rabbitmq')
})
