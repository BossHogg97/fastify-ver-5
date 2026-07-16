import { defineConfig } from 'drizzle-kit'

const connectionString = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_DB_PORT}/${process.env.POSTGRES_DB_NAME}`

export default defineConfig({
  schema: './src/db/schemas/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: connectionString
  }
})
