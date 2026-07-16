import { STATUS_CODES } from 'http'
import { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { FastifySchemaValidationError } from 'fastify/types/schema'
import { ZodError } from 'zod'

interface ValidationError extends FastifyError {
  validation: FastifySchemaValidationError[]
}

interface HttpError extends FastifyError {
  statusCode: number
}

function formatZodError(zodError: ZodError) {
  return zodError.issues.map((issue) => ({
    field: issue.path.join('.') || '_root',
    message: issue.message,
    code: issue.code
  }))
}

function getErrorName(statusCode: number): string {
  return STATUS_CODES[statusCode] || 'Error'
}

function isValidationError(error: any): error is ValidationError {
  return error.validation !== undefined
}

function isHttpError(error: any): error is HttpError {
  return typeof error.statusCode === 'number'
}

function logHttpError(request: FastifyRequest, error: FastifyError, statusCode: number) {
  const base = { error: error.message, statusCode, url: request.url, method: request.method }
  if (statusCode >= 500) {
    request.log.error({ ...base, stack: error.stack }, 'Server error')
  } else {
    request.log.warn(base, 'Client error')
  }
}

export const setApiErrorHandler = (fastify: FastifyInstance) => {
  fastify.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
    // Zod validation errors
    if (error instanceof ZodError) {
      const details = formatZodError(error)
      request.log.warn({ errorMessage: 'Zod validation failed', validation: details, url: request.url, method: request.method }, 'Zod validation error')
      return reply.status(400).send({ statusCode: 400, error: 'Bad Request', code: 'VALIDATION_ERROR', message: 'Validation failed', details })
    }

    // Fastify schema validation errors
    if (isValidationError(error)) {
      request.log.warn({ errorMessage: error.message, validation: error.validation, url: request.url, method: request.method }, 'Validation error')
      return reply.status(400).send({ statusCode: 400, error: 'Bad Request', code: 'VALIDATION_ERROR', message: error.message, details: error.validation })
    }

    // HTTP errors with statusCode
    if (isHttpError(error)) {
      const { statusCode, message = 'Error', code } = error
      const errorName = getErrorName(statusCode)
      logHttpError(request, error, statusCode)
      return reply.status(statusCode).send({
        statusCode,
        error: errorName,
        code: code || errorName.toUpperCase().replace(/\s+/g, '_'),
        message
      })
    }

    // Unhandled errors → 500
    request.log.error({ errorMessage: error.message, stack: error.stack, type: error.name, url: request.url, method: request.method }, 'Unhandled error')
    return reply.status(500).send({
      statusCode: 500,
      error: 'Internal Server Error',
      code: 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : error.message
    })
  })
}
