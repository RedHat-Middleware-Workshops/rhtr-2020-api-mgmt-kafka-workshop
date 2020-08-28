import { MongoClient } from 'mongodb'
import config from './config'
import log from 'barelog'

export async function connectDB() {
  log('connecting to MongoDB')

  const mongoClient = await MongoClient.connect(config.MONGO_CONNECTION_STRING)

  const db = mongoClient.db('city-info')

  return db
}
