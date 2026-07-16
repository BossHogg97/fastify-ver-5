import { FastifyInstance } from 'fastify'

/**
 * Utility function that adds hooks for request logging
 * @param fastify contain the fastify instance
 * @param config contain the configuration keys
 */
export const setAPILogger = (fastify: FastifyInstance, config: any) => {
  const excludedPaths = ['/health', '/swagger', '/metrics']

  const shouldLog = (url: string): boolean => {
    return !excludedPaths.some((path) => url.includes(path))
  }

  // Log only incoming requests
  fastify.addHook('onRequest', async (request, _reply) => {
    if (shouldLog(request.url)) {
      request.log.debug(
        {
          method: request.method,
          url: request.url,
          reqId: request.id
        },
        `[${config.PROJECT_NAME.toLowerCase()}] - ${request.url}`
      )
    }
  })

  // Log only slow requests useful for performance monitoring
  fastify.addHook('onResponse', async (request, reply) => {
    if (shouldLog(request.url) && reply.elapsedTime && reply.elapsedTime > 3000) {
      request.log.info(
        {
          method: request.method,
          url: request.url,
          reqId: request.id,
          statusCode: reply.statusCode,
          responseTime: reply.elapsedTime
        },
        `[${config.PROJECT_NAME.toLowerCase()}] slow request detected`
      )
    }
  })
}
