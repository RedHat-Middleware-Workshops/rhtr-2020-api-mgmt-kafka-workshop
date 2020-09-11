import { createKnexDbProvider } from '@graphback/runtime-knex'
import { ApolloServer } from 'apollo-server-express'
import { buildGraphbackAPI } from 'graphback'
import { loadConfigSync } from 'graphql-config'
import { removeNonSafeOperationsFilter, migrateDB } from 'graphql-migrations'
import { connectDB, loadDBConfig } from './db'

/**
 * create Apollo server using automatically generated resolvers
 */
export const createApolloServer = () => {
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

  const { typeDefs, resolvers, contextCreator } = buildGraphbackAPI(modelDefs, {
    crud: {
      create: true,
      update: true,
      find: true,
      findOne: true,
      delete: true,
      subCreate: false,
      subUpdate: false,
      subDelete: false
    },
    dataProviderCreator: createKnexDbProvider(db)
  })

  const dbConfig = loadDBConfig()
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

  return apolloServer;
}

