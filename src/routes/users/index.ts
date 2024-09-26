import type { FastifyPluginAsync } from 'fastify'
import { $ref, usersSchema } from '@/routes/users/authservice.schema'
import { getUser } from './authservice.controller'

const authService: FastifyPluginAsync = async (fastify: any): Promise<void> => {
  for (const schema of usersSchema) {
    fastify.addSchema(schema)
  }

  /**
   * Get authservice
   */
  fastify.get('/user', {
    schema: {
      tags: ['Users'],
      summary: 'Users',
      description: 'Return keycloak information about the user',
      querystring: $ref('requestQuery'),
      response: {
        200: {
          ...$ref('responseUser'),
          description: 'Return an object containing the user details'
        },
        404: {
          ...$ref('responseErrorNotFound'),
          description: 'User not found'
        }
      }
    },
    handler: getUser
  })
}

export default authService
