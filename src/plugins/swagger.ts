import fp from 'fastify-plugin'
import { fastifySwagger } from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import { withRefResolver } from 'fastify-zod'
import type { FastifyInstance } from 'fastify'
import { formatToDateTime } from '@/utils/dateUtil'

import container from '@/core/diContainer'

/**
 * This plugins add Swagger for API documentation
 *
 * @see https://github.com/fastify/fastify-swagger
 * @see https://github.com/fastify/fastify-swagger-ui
 */
export default fp(async (fastify: FastifyInstance) => {
  const buildDate = formatToDateTime(new Date())

  const config = container.get('config.service')

  await fastify.register(
    fastifySwagger,
    withRefResolver({
      openapi: {
        info: {
          title: 'Fastify-boilerplate',
          description: 'Boilerplate',
          version: `ver. ${process.env['npm_package_version']} | Build date: ${buildDate}`
        },
        servers: [
          {
            url: `${config.swaggerServerUrl}${config.proxyPath}`
          }
        ],

        components: {
          securitySchemes: {
            // Oauth2 with PKCE flow
            oauth2: {
              type: 'oauth2',
              description: 'This API uses OAuth 2 with the authorizationCode grant flow',
              flows: {
                authorizationCode: {
                  authorizationUrl: `${config.keycloakBaseUrl}/realms/xxxx/protocol/openid-connect/auth`,
                  tokenUrl: `${config.keycloakBaseUrl}/realms/xxxx/protocol/openid-connect/token`,
                  scopes: {}
                }
              }
            },
            // Bearer token flow
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT' //optional, arbitrary value for documentation purposes
            }
          }
        },
        security: [
          {
            oauth2: [],
            bearerAuth: []
          }
        ]
        // tags: [
        //   {
        //     name: 'Root',
        //     description: 'Root endpoints'
        //   }
        // ]
      }
    })
  )

  /**
   * Definition API to address the swagger start page
   */
  await fastify.register(fastifySwaggerUI, {
    routePrefix: '/swagger',
    staticCSP: false,
    initOAuth: {
      clientId: config.environment === 'production' ? 'swagger-authservice' : 'swagger-authservice-localhost'
    },
    transformSpecification: (swaggerObject, req, reply) => {
      swaggerObject.servers[0].url = config.environment === 'production' ? `https://${req.hostname}${config.proxyPath}` : `http://${req.hostname}`
      return swaggerObject
    },
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false
    }
  })

  fastify.log.debug('Registered plugins swagger')
})
