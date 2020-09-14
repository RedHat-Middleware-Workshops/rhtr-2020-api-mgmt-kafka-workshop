import { ApolloServer } from 'apollo-server-express'
import cors from 'cors'
import express from 'express'
import http from 'http'
import { HTTP_RESPONSE_DELAY, NODE_ENV, HTTP_PORT } from './config'
import { createApolloServer } from './graphback'

const app = express()

app.use(cors())

app.use((req: Express.Request, res: Express.Response, next) => {
  if (HTTP_RESPONSE_DELAY && NODE_ENV === 'dev') {
    // Simulate request processing time in dev mode
    setTimeout(() => next(), HTTP_RESPONSE_DELAY)
  } else {
    next()
  }
})

createApolloServer()
  .then((apolloServer: ApolloServer) => {
    apolloServer.applyMiddleware({ app })

    const httpServer = http.createServer(app)
    apolloServer.installSubscriptionHandlers(httpServer)

    httpServer.listen({ port: HTTP_PORT }, () => {
      console.log(
        `🚀  Graphback Server ready at http://localhost:${HTTP_PORT}/graphql \nFor more information see: https://graphback.dev`
      )
    })
  })
  .catch((error) => {
    console.log(`Error: ${error}`)
  })
