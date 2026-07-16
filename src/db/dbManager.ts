// db/dbManager.ts
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'

import { getLogger } from '../core/loggerManager'

type DBConnection = {
  POSTGRES_HOST: string
  POSTGRES_USER: string
  POSTGRES_PASSWORD: string
  POSTGRES_DB_NAME: string
  POSTGRES_DB_PORT: number
}

class DatabaseManager {
  private static instance: DatabaseManager | null = null
  private _db: NodePgDatabase | null = null
  private _pool: pg.Pool | null = null
  private _connectionString: string | null = null
  private _config: DBConnection | null = null

  private constructor() {}

  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager()
    }
    return DatabaseManager.instance
  }

  initialize(config: DBConnection): void {
    if (this._db) {
      const logger = getLogger()
      logger.warn('Database already initialized')
      return
    }

    const logger = getLogger()
    const { Pool } = pg

    // Validate required environment variables with type checking
    const requiredEnvVars: Array<keyof DBConnection> = ['POSTGRES_USER', 'POSTGRES_PASSWORD', 'POSTGRES_HOST', 'POSTGRES_DB_NAME']

    const missing: string[] = []
    const invalid: string[] = []

    requiredEnvVars.forEach((key) => {
      const value = config[key]
      if (!value) {
        missing.push(key)
      } else if (typeof value !== 'string' && typeof value !== 'number') {
        invalid.push(`${key} (got ${typeof value}, expected string or number)`)
      }
    })

    if (missing.length > 0) {
      const error = new Error(`Missing required environment variables: ${missing.join(', ')}`)
      logger.error({ missing }, error.message)
      throw error
    }

    if (invalid.length > 0) {
      const error = new Error(`Invalid environment variable types: ${invalid.join(', ')}`)
      logger.error({ invalid }, error.message)
      throw error
    }

    // Store config for later use
    this._config = config

    // Create connection string
    this._connectionString = `postgresql://${config.POSTGRES_USER}:${config.POSTGRES_PASSWORD}@${config.POSTGRES_HOST}:${config.POSTGRES_DB_PORT}/${config.POSTGRES_DB_NAME}`

    // Initialize pool
    this._pool = new Pool({
      connectionString: this._connectionString,
      max: 10,
      idleTimeoutMillis: 30000
    })

    // Error handling
    this._pool.on('error', (err) => {
      logger.error({ err }, 'Unexpected pool error')
    })

    // Initialize drizzle instance
    this._db = drizzle(this._pool, {
      logger: false
    })

    logger.debug('Database connection initialized')
  }

  getDb(): NodePgDatabase {
    if (!this._db) {
      throw new Error('Database not initialized. Call initialize() first.')
    }
    return this._db
  }

  getConfig(): DBConnection {
    if (!this._config) {
      throw new Error('Database not initialized. Call initialize() first.')
    }
    return this._config
  }

  getConnectionString(): string {
    if (!this._connectionString) {
      throw new Error('Database not initialized. Call initialize() first.')
    }
    return this._connectionString
  }

  getPool(): pg.Pool {
    if (!this._pool) {
      throw new Error('Database not initialized. Call initialize() first.')
    }
    return this._pool
  }

  async close(): Promise<void> {
    if (this._pool) {
      const logger = getLogger()
      await this._pool.end()
      this._db = null
      this._pool = null
      this._connectionString = null
      this._config = null
      logger.debug('Database connection closed')
    }
  }

  isInitialized(): boolean {
    return this._db !== null
  }
}

// Export singleton instance getter
export const dbManager = DatabaseManager.getInstance()

// Convenience function
export const getDb = () => dbManager.getDb()

// Create connection string from environment variables
export const connectionString = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_DB_PORT}/${process.env.POSTGRES_DB_NAME}`
