import 'dotenv/config'
import { z } from 'zod'

export const envSchema = z.object({
  PROJECT_NAME: z.string().default('fastify-boilerplate'),
  HOST: z.string().default('localhost'),
  NODE_ENV: z.string().default('development'),
  PROXY_PATH: z.string().default('/'),
  PORT: z.coerce.number().default(5003),
  SWAGGER_SERVER_URL: z.url().default('http://localhost:5003'),
  ALLOWED_ORIGINS: z.string().default('*'),

  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),

  // Database Configuration
  POSTGRES_HOST: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB_NAME: z.string().default('fastifyboilerplatedb'),
  POSTGRES_DB_PORT: z.coerce.number().default(5432),

  // RabbitMQ
  RABBITMQ_ENABLED: z
    .string()
    .optional()
    .default('true')
    .transform((val) => val === 'true'),
  RABBITMQ_URL: z.string().default('amqp://guest:guest@localhost').describe('Default value is for reference')
})

export type Config = z.infer<typeof envSchema>
export const config = envSchema.parse(process.env)
