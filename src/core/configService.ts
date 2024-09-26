import { z } from 'zod'
import dotenv from 'dotenv'

/**
 * The ConfigService class provides access to configuration values loaded from environment variables and .env files.
 * It makes the loaded configuration available via public readonly properties.
 */
export class ConfigService {
  public readonly environment: 'development' | 'production' | 'test'
  public readonly host: string | undefined
  public readonly port: number | undefined
  public readonly logLevel: string | undefined
  public readonly swaggerServerUrl: string | undefined
  public readonly lokiServerUrl: string | undefined
  public readonly proxyPath: string | undefined
  public readonly keycloakBaseUrl: URL | undefined
  public readonly keycloakRealm: string | undefined
  public readonly keycloakClientId: string | undefined
  public readonly keycloakClientSecret: string | undefined

  /**
   * The constructor function for the ConfigService class.
   * It loads configuration from environment variables and validates them against a schema.
   * The schema is defined using Zod. Environment variables are loaded from .env files using dotenv.
   * Configuration is parsed and validated on instantiation and made available via public properties on the class.
   */
  constructor() {
    const rootFolder = process.cwd()

    const envFile = `${rootFolder}/.env.${process.env['NODE_ENV']}`
    // console.log(`Searching ${envFile}`)
    dotenv.config({ path: `${envFile}` })

    const envFileLocal = `${rootFolder}/.env.${process.env['NODE_ENV']}.local`
    // console.log(`Searching ${envFileLocal}`)
    dotenv.config({ path: `${envFileLocal}`, override: true })

    const appConfigSchema = z.object({
      NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
      HOST: z.string().default('localhost'),
      PORT: z.string().default('5015').transform(Number),
      LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
      SWAGGER_SERVER_URL: z.string().default('http://localhost:5015'),
      LOKI_SERVER_URL: z.string().optional().default(''),
      PROXY_PATH: z.string().optional().default(''),
      KEYCLOAK_BASE_URL: z.string().optional(),
      KEYCLOAK_REALM: z.string().optional(),
      KEYCLOAK_CLIENT_ID: z.string().optional()
    })

    const parsed = appConfigSchema.safeParse(process.env)

    if (!parsed.success) {
      const jsonConfig = JSON.stringify(parsed, null, 4)
      throw new Error(`❌ Invalid environment variables: ${jsonConfig}`)
    }

    this.environment = parsed.data.NODE_ENV
    this.host = parsed.data.HOST
    this.port = parsed.data.PORT
    this.logLevel = parsed.data.LOG_LEVEL
    this.swaggerServerUrl = parsed.data.SWAGGER_SERVER_URL
    this.lokiServerUrl = parsed.data.LOKI_SERVER_URL
    this.proxyPath = parsed.data.PROXY_PATH
    this.keycloakBaseUrl = new URL(parsed.data.KEYCLOAK_BASE_URL)
    this.keycloakRealm = parsed.data.KEYCLOAK_REALM
    this.keycloakClientId = parsed.data.KEYCLOAK_CLIENT_ID

    // console.log('✅ Environment variables loaded', parsed.data)
    // console.log(typeof this.booleanString.parse(parsed.data.TOKEN_AUTH))
  }
}

/**
 * Exports the singleton instance of the ConfigService class.
 * This provides access to the loaded configuration from environment variables.
 */
export const config = new ConfigService()
