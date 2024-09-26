import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'
import { responseErrorNotFound, responseMessage } from '@/common/base.schema'

export const requestQuery = z.object({
  userId: z.string().describe('User ID')
})

export const responseUser = z.object({
  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string()
})

export type RequestQueryUser = z.infer<typeof requestQuery>
export type ResponseUser = z.infer<typeof responseUser>

export const { schemas: usersSchema, $ref } = buildJsonSchemas(
  {
    requestQuery,
    responseUser,
    responseErrorNotFound,
    responseMessage
  },
  {
    $id: 'usersSchema'
  }
)
