// Plugin Imports
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'

// Fastif Imports
import fastifyPlugin from 'fastify-plugin'
import { withRefResolver } from 'fastify-zod'

// Utility Imports
import { readFileSync } from 'fs'
import path from 'path'

/**
 * Swagger plugin configuration for Fastify
 * Provides API documentation with OAuth2 support
 */
export default fastifyPlugin(async function (
  fastify: any,
  options: {
    config: any
    projectLogo: string
    components?: any
    security?: any
    transform?: any
    transformObject?: any
    configUI?: Record<string, any>
  }
) {
  // Get application metadata from package.json
  const appMeta = JSON.parse(readFileSync(`${process.cwd()}/package.json`, 'utf-8')) as { name: string; version: string; description: string }

  const { projectLogo } = options
  const staticPath = path.join(process.cwd(), 'packages/sharedbe/static')

  // Register Swagger schema generator
  await fastify.register(
    swagger,
    withRefResolver({
      ...(options.transform && { transform: options.transform }),
      ...(options.transformObject && {
        transformObject: options.transformObject
      }),
      openapi: {
        info: {
          title: `${options.config.PROJECT_NAME}`,
          description: `${appMeta.description} <br/><br/><img src="${projectLogo}" width="30%" />`,
          version: appMeta.version
        },
        servers: [
          {
            url: `${options.config.SWAGGER_SERVER_URL}${options.config.PROXY_PATH}`
          }
        ],

        components: !options.components
          ? {
              securitySchemes: {
                oauth2: {
                  type: 'oauth2',
                  description: '** OAuth2 with authorizationCode grant flow **',
                  flows: {
                    authorizationCode: {
                      authorizationUrl: `${options.config.KEYCLOAK_BASE_URL}/realms/pomini/protocol/openid-connect/auth`,
                      tokenUrl: `${options.config.KEYCLOAK_BASE_URL}/realms/pomini/protocol/openid-connect/token`,
                      scopes: {}
                    }
                  }
                },
                bearerAuth: {
                  type: 'http',
                  description: '** OAuth2 Bearer token flow **',
                  scheme: 'bearer',
                  bearerFormat: 'JWT'
                }
              }
            }
          : options.components,

        security: !options.security ? [{ oauth2: [] }, { bearerAuth: [] }] : options.security
      },
      hideUntagged: true
    })
  )

  // Register Swagger UI
  await fastify.register(swaggerUI, {
    routePrefix: '/swagger',
    indexPrefix: options.config.PROXY_PATH === '/' ? '' : options.config.PROXY_PATH,
    staticCSP: false,
    initOAuth: !options.components
      ? {
          clientId:
            options.config.NODE_ENV === 'production'
              ? `swagger-${options.config.PROJECT_NAME.toLowerCase().replace(/_/g, '-')}`
              : `swagger-${options.config.PROJECT_NAME.toLowerCase().replace(/_/g, '-')}-localhost`
        }
      : {},
    transformSpecification: (swaggerObject, req, _reply) => {
      swaggerObject.servers[0].url =
        options.config.NODE_ENV === 'production' ? `https://${req.hostname}${options.config.PROXY_PATH}` : `http://${req.hostname}:${req.port}`
      return swaggerObject
    },
    logo: {
      type: 'image/png',
      content: readFileSync(path.join(staticPath, 'Pomini_palla_100x92.png'))
    },
    theme: {
      favicon: [
        {
          filename: 'favicon.png',
          rel: 'icon',
          sizes: '16x16',
          type: 'image/png',
          content: readFileSync(path.join(staticPath, 'favicon.ico'))
        }
      ]
    },
    uiConfig: {
      docExpansion: 'none',
      deepLinking: false,
      tryItOutEnabled: true,
      filter: true,
      persistAuthorization: true,
      // set custom opts
      ...options.configUI
    }
  })

  fastify.log.debug('Registered plugin fastify-swagger')
})
