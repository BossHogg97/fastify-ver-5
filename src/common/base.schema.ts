import { z } from 'zod'

export const idGenerated = {
  _id: z.string().uuid().describe('Unique identifier')
}

export const baseMessage = {
  code: z.optional(z.string()).describe('OK | KO | other | (optional)'),
  level: z.optional(z.string()).describe('error level: info | warning | error | critical | (optional)'),
  message: z.optional(z.string()).describe('long text error (optional)')
}

export const responseMessage = z.object({
  ...baseMessage
})

export const errorMessage = z.object({
  statusCode: z.optional(z.number()).describe('http statusCode (optional)'),
  error: z.string().describe('error'),
  ...baseMessage
})

export const responseErrorNotFound = z.object({
  ...baseMessage
})
