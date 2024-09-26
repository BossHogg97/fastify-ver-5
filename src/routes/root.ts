import type { FastifyPluginAsync } from 'fastify'

const unauthorizedHandler: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get('/health', { schema: { hide: false } }, async function () {
    return {
      status: 'Authservice is up and running :o)',
      isUp: true
    }
  })

  fastify.get('/doc', { schema: { hide: true } }, async (_request, reply) => reply.sendFile('doc.html'))

  fastify.get('/oauth-receiver.html', { schema: { hide: true } }, async (request, reply) => {
    fastify.log.debug('OAUTH RECEIVER ROUTE')
    reply.redirect('/doc')
  })
}

export default unauthorizedHandler
