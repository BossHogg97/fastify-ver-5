import fp from 'fastify-plugin'

export default fp(async (fastify) => {
  // Register a custom content type parser for the specified MIME types
  fastify.addContentTypeParser(
    [
      'image/svg+xml', // SVG content sent as text
      'text/plain' // Plain text content
      // 'application/json' // JSON content (parsed as raw string)
    ],
    {
      // Instruct Fastify to provide the request body as a string
      // instead of automatically parsing it
      parseAs: 'string'
    },
    // Custom parser function
    (_req, body, done) => {
      // Return the body as-is, without any transformation
      done(null, body)
    }
  )

  // Debug log to confirm that the plugin was registered
  fastify.log.debug('Registered content type parser plugin')
})
