import { loggerManager, getLogger, createServerOptions } from '@/core/index'
import { dbManager, migrateDatabase } from '@/db/index'

import figlet from 'figlet'
import { createApp } from './app'
import { config } from './config/config'

const start = async () => {
  // 1. Initialize logger FIRST (before anything else)
  loggerManager.initialize({
    PROJECT_NAME: config.PROJECT_NAME,
    NODE_ENV: config.NODE_ENV,
    LOG_LEVEL: config.LOG_LEVEL
  })

  const logger = getLogger()
  logger.debug(`Server starting in ${config.NODE_ENV} mode`)

  // 2. Initialize database connection

  // 2.1 - PostgreSQL init
  try {
    dbManager.initialize({
      POSTGRES_HOST: config.POSTGRES_HOST,
      POSTGRES_USER: config.POSTGRES_USER,
      POSTGRES_PASSWORD: config.POSTGRES_PASSWORD,
      POSTGRES_DB_NAME: config.POSTGRES_DB_NAME,
      POSTGRES_DB_PORT: config.POSTGRES_DB_PORT
    })
    logger.debug('Database manager initialized')
  } catch (error) {
    logger.error({ err: error }, 'Failed to initialize database manager')
    process.exit(1)
  }

  // 2.2 - MongoDB init
  // TODO Implementare inizializzazione

  // 3. Run database migrations
  try {
    await migrateDatabase()
    logger.debug('Database migrations completed')
  } catch (error) {
    logger.error({ err: error }, 'Database migration failed')
    await dbManager.close()
    process.exit(1)
  }

  // 4. Create server options with initialized logger
  const serverOptions = createServerOptions()
  const app = await createApp(serverOptions)

  const { HOST: host, PORT: port } = config
  const serverUrl = `http://${host}:${port}`

  // 5. Setup graceful shutdown
  const shutdown = async (signal: string) => {
    logger.info(`${signal} received, shutting down gracefully...`)
    try {
      await dbManager.close()
      await app.close()
      logger.info('Graceful shutdown completed')
      process.exit(0)
    } catch (error) {
      logger.error({ err: error }, 'Error during shutdown')
      process.exit(1)
    }
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))

  // 6. Start the server
  try {
    await app.listen({ host, port })

    // Use console.log for figlet (visual appeal)
    console.log('\r\n' + figlet.textSync(config.PROJECT_NAME))

    // Use structured logging for important info
    logger.info({ url: serverUrl }, `Swagger docs available at ${serverUrl}/swagger`)
    logger.info(
      {
        projectName: config.PROJECT_NAME,
        environment: config.NODE_ENV,
        host,
        port
      },
      `${config.PROJECT_NAME} IS READY`
    )
  } catch (error) {
    logger.error({ err: error }, 'Failed to start server')
    await dbManager.close()
    process.exit(1)
  }
}

start()
