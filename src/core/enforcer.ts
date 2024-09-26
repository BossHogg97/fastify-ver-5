import axios from 'axios'
import { logger } from './logger'
import { FastifyReply, FastifyRequest } from 'fastify'

const keycloakConfig = {
  realm: process.env.KEYCLOAK_REALM,
  authServerUrl: process.env.KEYCLOAK_BASE_URL,
  clientId: process.env.KEYCLOAK_CLIENT_ID
}

/**
 * This function will be called as preHandler and check if the keycloak token is valid or not
 * @param request contain the fastify request
 * @param reply
 */
async function enforce(request: FastifyRequest, reply: FastifyReply | any) {
  // Get authorization token from header
  const auth = request.headers.authorization

  logger.info(request.routeOptions.config, 'Enforcing policy')
  if (auth == undefined) {
    reply.code(401)
    reply.send('Unauthorized')
  }

  // Get from auth header only the token (ignore `Bearer`)
  const token = auth.split(' ')[1]

  const params = {
    grant_type: 'urn:ietf:params:oauth:grant-type:uma-ticket',
    audience: keycloakConfig.clientId,
    response_mode: 'decision',

    // From config object get resource and scope
    permission: reply.context.config.resource,
    scope: reply.context.config.scope
  }
  const urlParams = new URLSearchParams(params)

  try {
    // logger.info(`${keycloakConfig.authServerUrl}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`)

    await axios.post(`${keycloakConfig.authServerUrl}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`, urlParams, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  } catch (error: any) {
    logger.error(error.response, 'Keycloak response was not successful, access to resource was not granted')
    const { status, statusText } = error.response
    const { error: errorType, error_description: errorDescription } = error.response.data

    // logger.error('STATUS ' + status)
    // logger.error('STATUS TEXT ' + statusText)

    reply.code(status)
    reply.send({
      errorType,
      errorDescription,
      status,
      statusText
    })
  }
}
export default enforce
