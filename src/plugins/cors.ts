import cors from '@fastify/cors'
import fp from 'fastify-plugin'

type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

type CorsOptions = {
  origin: string | string[]
  methods: Methods[]
}

/**
 * This plugin enables the use of CORS in a Fastify application.
 *
 * @see https://www.npmjs.com/package/@fastify/cors
 */
export default fp(async (fastify: any, opts: CorsOptions) => {
  await fastify.register(cors, {
    origin: opts.origin,
    methods: opts.methods
  })

  fastify.log.debug('Registered plugin cors')
})
