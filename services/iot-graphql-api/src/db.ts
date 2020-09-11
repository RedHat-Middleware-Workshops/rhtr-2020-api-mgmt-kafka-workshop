import Knex from 'knex'
import config from './config'

export function loadDBConfig() {
  let port
  if (process.env.DB_PORT) {
    port = parseInt(process.env.DB_PORT, 10)
  }
  return {
    client: config.DB_CLIENT,
    connection: {
      user: config.DB_USER,
      password: config.DB_PASSWORD,
      database: config.DB_DATABASE,
      host: config.DB_HOST,
      port: port && !isNaN(port) ? port : 5432
    },
    pool: { min: 5, max: 30 }
  }
}

export function connectDB() {
  const dbConfig = loadDBConfig()
  const db = Knex(dbConfig)

  return db
}
