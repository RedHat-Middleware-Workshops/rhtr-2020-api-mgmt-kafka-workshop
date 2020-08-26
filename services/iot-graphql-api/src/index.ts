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

async function start() {
  const app = express()

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

  const httpServer = http.createServer(app)
  apolloServer.installSubscriptionHandlers(httpServer)

  httpServer.listen({ port: 4000 }, () => {
    log(`🚀 server ready at http://localhost:4000/graphql`)
  })
}

start().catch((err) => {
  log('error starting server')
  log(err)
  process.exit(1)
})
