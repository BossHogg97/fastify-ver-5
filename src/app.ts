import { PrettyPrint } from '@/config/prettyPrint'
import { setApiErrorHandler, setAPILogger } from '@/hooks/index'

import Fastify, { FastifyServerOptions } from 'fastify'
import {
  fastifyZodOpenApiPlugin,
  fastifyZodOpenApiTransform,
  fastifyZodOpenApiTransformObject,
  FastifyZodOpenApiTypeProvider,
  serializerCompiler,
  validatorCompiler
} from 'fastify-zod-openapi'

import { Config, config } from './config/config'

// Import Schemas
import { todosSchemas } from './routes/todos/todos.schema'

// Import routes
import todosRoutes from './routes/todos/todos.routes'

// Enumerator Import
import { RabbitServices } from '@/enums/index'

/**
 * Creates and configures a Fastify application instance
 *
 * @param opts - Fastify server options
 * @returns Configured Fastify instance
 */
export const createApp = async (opts: FastifyServerOptions = {}) => {
  const app = Fastify(opts)

  // Set logger hook for API request/reply
  setAPILogger(app, config)
  setApiErrorHandler(app)

  app.withTypeProvider<FastifyZodOpenApiTypeProvider>()
  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  app.decorate('config', config)

  // Open API schemas
  const allSchemas = {
    ...todosSchemas
  }

  // register schemas
  await app.register(fastifyZodOpenApiPlugin, {
    components: {
      schemas: allSchemas
    }
  })

  // fastify/cors
  await app.register(import('@/plugins/cors'), {
    origin: config.ALLOWED_ORIGINS,
    methods: ['GET', 'POST', 'PUT', 'DELETE'] as any
  })

  // static
  await app.register(import('@/plugins/static'))

  // qs
  await app.register(import('@/plugins/qs'))

  // swagger
  await app.register(import('@/plugins/swagger'), {
    config,
    projectLogo: `${getBasePathLogo(config)}/public/Pomini_Gemini.png`,
    transform: fastifyZodOpenApiTransform,
    transformObject: fastifyZodOpenApiTransformObject
  })

  // RabbitMQ plugin
  if (config.RABBITMQ_ENABLED) {
    app.log.info('Registering rabbit service')
    await app.register(import('@/plugins/rabbitmq'), {
      connection: {
        url: config.RABBITMQ_URL,
        connectionName: RabbitServices.SERVICE_NAME
      }
    })

    // Register and initialize [publishers] and [consumers]
    await app.register(import('./rabbitmq/test.consumer'))
    await app.register(import('./rabbitmq/test.publisher'))
  }

  // Register API routes with appropriate prefixes
  const routes = [{ handler: todosRoutes, prefix: '/todos' }]

  // Register all routes
  for (const route of routes) {
    await app.register(route.handler, { prefix: route.prefix })
  }

  // Configure root route to redirect to Swagger UI
  app.get('/', async (_request, reply) => {
    reply.redirect('/swagger')
  })

  // Wait for all plugins to be ready
  await app.ready()

  // Log configuration prettily
  new PrettyPrint(app.log, config).prettyPrint()

  return app
}

/**
 * Helper to determine base path for logos depending on environment
 */
function getBasePathLogo(config: Config): string {
  return config.NODE_ENV === 'production' ? config.PROXY_PATH : ''
}
