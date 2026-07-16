import { Database, Service, ServiceOptions, IDocument, MongoClientOptions } from '@paralect/node-mongo'
import { getLogger } from '../core/loggerManager'

type MongoConfig = {
  MONGO_URL: string
  MONGO_DATABASE: string
  MONGO_USER: string
  MONGO_PASS: string
}

class MongoManager {
  private static instance: MongoManager | null = null
  private _db: Database | null = null
  private _connectionString: string | null = null
  private _mongoClientOptions: MongoClientOptions | null = null
  private _config: MongoConfig | null = null
  private _logger: any

  private constructor() {}

  static getInstance(): MongoManager {
    if (!MongoManager.instance) {
      MongoManager.instance = new MongoManager()
    }
    return MongoManager.instance
  }

  initialize(config: MongoConfig): void {
    this._logger = getLogger()

    if (this._db) {
      this._logger.warn('Database already initialized')
      return
    }

    // Validate required environment variables with type checking
    const requiredEnvVars: Array<keyof MongoConfig> = ['MONGO_URL', 'MONGO_DATABASE', 'MONGO_USER', 'MONGO_PASS']

    const missing: string[] = []

    requiredEnvVars.forEach((key) => {
      const value = config[key]
      if (!value) {
        missing.push(key)
      }
    })

    if (missing.length > 0) {
      const error = new Error(`Missing required environment variables: ${missing.join(', ')}`)
      this._logger.error({ missing }, error.message)
      throw error
    }

    // Store config
    this._config = config

    // Create connection string
    this._connectionString = `${config.MONGO_URL}/${config.MONGO_DATABASE}`

    // Initialize Mongo Options
    this._mongoClientOptions = {
      auth: {
        username: config.MONGO_USER,
        password: config.MONGO_PASS
      },
      authSource: 'admin',
      directConnection: true,
      connectTimeoutMS: 30000,
      serverSelectionTimeoutMS: 30000
      // socketTimeoutMS: SOCKET_TIME_OUT_MS,
      // connectTimeoutMS: CONNECTION_TIMEOUT_MS
    }

    // Create database connection
    this._db = new Database(this._connectionString, this._config.MONGO_DATABASE, this._mongoClientOptions)
  }

  async connect(): Promise<void> {
    if (!this._db) {
      throw new Error('Database not initialized. Call initialize() first.')
    }

    try {
      await this._db.connect()
      this._logger.info('MongoDB connected successfully')
    } catch (error) {
      this._logger.error({ error }, 'Failed to connect to MongoDB')
      throw error
    }
  }

  createService<T extends IDocument>(collectionName: string, options: ServiceOptions = {}): Service<T> {
    if (!this._db) {
      throw new Error('Database not initialized. Call initialize() and connect() first.')
    }

    return new Service<T>(collectionName, this._db, options)
  }

  get db(): Database {
    if (!this._db) {
      throw new Error('Database not initialized. Call initialize() first.')
    }
    return this._db
  }

  get isInitialized(): boolean {
    return this._db !== null
  }
}

export const mongoManager = MongoManager.getInstance()
export default MongoManager
