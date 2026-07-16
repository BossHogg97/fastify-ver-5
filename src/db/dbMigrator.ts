// db/dbMigrator.ts
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import pg from 'pg'

import { getLogger } from '../core/loggerManager'
import { dbManager } from './dbManager'

const { Pool } = pg

export async function migrateDatabase() {
  const logger = getLogger()
  const config = dbManager.getConfig() // Get config from initialized manager
  const dbName = config.POSTGRES_DB_NAME
  const db = dbManager.getDb()

  try {
    const wasCreated = await createDatabaseIfNotExists()

    const migrationsFolder = `${process.cwd()}/drizzle`

    if (wasCreated) {
      logger.debug(`Running migrations to database ${dbName}...`)
      await migrate(db, { migrationsFolder })
      logger.debug(`Migrations successfully applied to ${dbName} database`)
    } else {
      const appliedCount = await getAppliedMigrationsCount()

      logger.debug(`Running migrations to database ${dbName}...`)
      await migrate(db, { migrationsFolder })

      const newAppliedCount = await getAppliedMigrationsCount()

      if (newAppliedCount > appliedCount) {
        logger.debug(
          {
            before: appliedCount,
            after: newAppliedCount,
            newMigrations: newAppliedCount - appliedCount
          },
          `Migrations successfully applied to ${dbName} database`
        )
      } else {
        logger.debug(`No migrations needed for ${dbName} database`)
      }
    }
  } catch (error) {
    logger.error({ err: error }, `Failed to migrate ${dbName} database`)
    throw error
  }
}

async function getAppliedMigrationsCount(): Promise<number> {
  const db = dbManager.getDb()

  try {
    const result = await db.execute(`
      SELECT COUNT(*) as count 
      FROM __drizzle_migrations
    `)
    return Number(result.rows[0]?.count || 0)
  } catch {
    return 0
  }
}

async function createDatabaseIfNotExists(): Promise<boolean> {
  const logger = getLogger()
  const config = dbManager.getConfig() // Get config from initialized manager
  const dbName = config.POSTGRES_DB_NAME

  // Validate password is a string before creating pool
  if (typeof config.POSTGRES_PASSWORD !== 'string' || !config.POSTGRES_PASSWORD) {
    const error = new Error('POSTGRES_PASSWORD must be a non-empty string')
    logger.error(
      {
        passwordType: typeof config.POSTGRES_PASSWORD,
        passwordValue: config.POSTGRES_PASSWORD ? '[REDACTED]' : 'undefined/null'
      },
      error.message
    )
    throw error
  }

  const pool = new Pool({
    user: config.POSTGRES_USER,
    host: config.POSTGRES_HOST,
    database: 'postgres',
    password: config.POSTGRES_PASSWORD, // Now guaranteed to be a string
    port: config.POSTGRES_DB_PORT
  })

  const client = await pool.connect()

  try {
    const result = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName])

    if (result.rows.length === 0) {
      await client.query(`CREATE DATABASE ${dbName}`)
      logger.debug(`Database ${dbName} created successfully`)
      return true
    } else {
      logger.debug(`Database ${dbName} already exists`)
      return false
    }
  } catch (error) {
    logger.error({ err: error }, 'Error in database creation')
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}
