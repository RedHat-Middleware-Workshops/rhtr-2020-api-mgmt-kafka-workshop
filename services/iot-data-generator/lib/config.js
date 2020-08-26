'use strict'

'use strict'

const { get } = require('env-var')

const SUPPORTED_TRANSPORTS = {
  CONSOLE: 'console',
  KAFKA: 'kafka'
}

module.exports = {
  HTTP_PORT: get('HTTP_PORT').default('8080').asPortNumber(),
  KAFKA_HOST: get('KAFKA_HOST').default('rhtr-cluster-kafka-brokers.amq-streams.svc:9092').asString(),
  MONGO_CONNECTION_STRING: get('MONGO_CONNECTION_STRING').default('mongodb://rhtr-admin:changethistosomethingelse@mongodb.city-of-losangeles.svc:27017/').asUrlString(),
  SUPPORTED_TRANSPORTS,
  TRANSPORT_MODE: get('TRANSPORT_MODE').default('console').asEnum(Object.values(SUPPORTED_TRANSPORTS))
}
