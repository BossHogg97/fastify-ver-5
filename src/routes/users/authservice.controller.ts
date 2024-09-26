// Fastify Imports
import { FastifyReply, FastifyRequest } from 'fastify'
import { logger } from '@/core/logger'

import axios from 'axios'

// Schema Import
import { RequestQueryUser, ResponseUser } from './authservice.schema'

export const getUser = async (request: FastifyRequest<{ Querystring: RequestQueryUser }>, reply: FastifyReply) => {
  const auth = request.headers.authorization

  const response = await axios.get(`${process.env.KEYCLOAK_BASE_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users/${request.query.userId}`, {
    headers: {
      Authorization: auth
    }
  })

  const userDetails: ResponseUser = {
    username: response.data.username,
    firstName: response.data.firstName,
    lastName: response.data.lastName,
    email: response.data.email
  }

  reply.code(200).send(userDetails) // Se non definisco la shape non riesco a ritornare l'oggetto
}
