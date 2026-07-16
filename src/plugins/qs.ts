import fastifyPlugin from 'fastify-plugin'
import fastifyQs from 'fastify-qs'

export default fastifyPlugin(async function (fastify: any) {
  await fastify.register(fastifyQs, {})

  fastify.log.debug(`Registered plugin fastify-qs`)
})
