import fp from 'fastify-plugin'
import multer from 'fastify-multer'

/**
 * Multer is a Fastify plugin for handling multipart/form-data,
 * which is primarily used for uploading files.
 *
 * @see https://www.npmjs.com/package/fastify-multer
 */
export default fp(async (fastify) => {
  await fastify.register(multer.contentParser)
  fastify.log.debug('Registered plugin multer')
})
