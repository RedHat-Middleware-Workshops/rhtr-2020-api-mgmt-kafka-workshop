import { MongoClient } from 'mongodb'
import config from './config'
import log from 'barelog'

export async function connectDB() {
  let url: string

  const {
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT,
    DB_DATABASE,
    DB_AUTHSOURCE
  } = config.MONGODB

  if (DB_USER && DB_PASSWORD) {
    log('connecting to MongoDB with authentication')
    url = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}?authSource=${DB_AUTHSOURCE}`
  } else {
    log('connecting to MongoDB without authentication')
    url = `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`
  }

  const mongoClient = await MongoClient.connect(url, {
    useUnifiedTopology: true
  })

  const db = mongoClient.db(DB_DATABASE)

  return db
}
