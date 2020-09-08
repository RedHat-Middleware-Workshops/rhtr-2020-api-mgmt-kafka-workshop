import { ApolloServer } from 'apollo-server-express'
import cors from 'cors'
import express from 'express'
import http from 'http'
import { buildGraphbackAPI } from 'graphback'
import { loadDBConfig, connectDB } from './db'
import { migrateDB, removeNonSafeOperationsFilter } from 'graphql-migrations'
import { createKnexDbProvider } from '@graphback/runtime-knex'
import { loadConfigSync } from 'graphql-config'
import { HTTP_RESPONSE_DELAY, NODE_ENV, HTTP_PORT } from './config'

const app = express()

app.use(cors())

app.use((req, res, next) => {
  if (HTTP_RESPONSE_DELAY && NODE_ENV === 'dev') {
    // Simulate request processing time in dev mode
    setTimeout(() => next(), HTTP_RESPONSE_DELAY)
  } else {
    next()
  }
})

const graphbackExtension = 'graphback'
const config = loadConfigSync({
  extensions: [
    () => ({
      name: graphbackExtension
    })
  ]
})

const projectConfig = config.getDefault()
const graphbackConfig = projectConfig.extension(graphbackExtension)
const modelDefs = projectConfig.loadSchemaSync(graphbackConfig.model)

const db = connectDB()
const dbConfig = loadDBConfig()

const { typeDefs, resolvers, contextCreator } = buildGraphbackAPI(modelDefs, {
  dataProviderCreator: createKnexDbProvider(db)
})

migrateDB(dbConfig, typeDefs, {
  operationFilter: removeNonSafeOperationsFilter
}).then(() => {
  console.log('Migrated database')
})

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers: [resolvers],
  context: contextCreator
})

apolloServer.applyMiddleware({ app })

const httpServer = http.createServer(app)
apolloServer.installSubscriptionHandlers(httpServer)

httpServer.listen({ port: HTTP_PORT }, () => {
  console.log(`🚀  Server ready at http://localhost:${HTTP_PORT}/graphql`)
})
