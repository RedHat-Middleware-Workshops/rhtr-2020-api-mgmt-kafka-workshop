import log from 'barelog'
import path from 'path'
import http from 'http'
import { ApolloServer } from 'apollo-server-express'
import { buildGraphbackAPI } from 'graphback'
import { loadSchemaSync } from '@graphql-tools/load'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import {
  createDataSyncMongoDbProvider,
  createDataSyncCRUDService,
  DataSyncPlugin
} from '@graphback/datasync'
import express from 'express'
import { PubSub } from 'graphql-subscriptions'
import { connectDB } from './db'
import { HTTP_RESPONSE_DELAY, HTTP_PORT, NODE_ENV } from './config'

async function start() {
  const app = express()
  const httpServer = http.createServer(app)

  app.use((req, res, next) => {
    if (HTTP_RESPONSE_DELAY && NODE_ENV !== 'prod') {
      // Simulate a request with a slow response time.
      // Will always be disabled in production, even if HTTP_RESPONSE_DELAY is set.
      setTimeout(() => next(), HTTP_RESPONSE_DELAY)
    } else {
      next()
    }
  })
  app.use(require('cors')())
  app.use(require('compression')())

  const modelDefs = loadSchemaSync(path.resolve('./model/*.graphql'), {
    loaders: [new GraphQLFileLoader()]
  })

  const db = await connectDB()

  const { typeDefs, resolvers, contextCreator } = buildGraphbackAPI(modelDefs, {
    dataProviderCreator: createDataSyncMongoDbProvider(db),
    serviceCreator: createDataSyncCRUDService({ pubSub: new PubSub() }),
    plugins: [new DataSyncPlugin()]
  })

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: contextCreator
  })

  apolloServer.applyMiddleware({ app })
  apolloServer.installSubscriptionHandlers(httpServer)

  // Always redirect / to the /graphql endpoint
  app.get('/', (req, res) => {
    res.redirect('/graphql')
  })

  httpServer.listen({ port: HTTP_PORT }, () => {
    log(`🚀 server ready at http://localhost:${HTTP_PORT}/graphql`)
  })
}

start().catch((err) => {
  log('error starting server')
  log(err)
  process.exit(1)
})
