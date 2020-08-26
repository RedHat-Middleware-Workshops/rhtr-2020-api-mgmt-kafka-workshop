'use strict'

'use strict'

const { get } = require('env-var')

const SUPPORTED_TRANSPORTS = {
  CONSOLE: 'console',
  PSQL: 'psql',
  KAFKA: 'kafka',
  AQMP: 'amqp'
}

module.exports = {
  HTTP_PORT: get('HTTP_PORT').default('8080').asPortNumber(),
  KAFKA_HOST: get('KAFKA_HOST').default('integreatly-cluster-kafka-brokers.amq-streams.svc:9092').asString(),
  PG_CONNECTION_STRING: get('PG_CONNECTION_STRING').default('postgresql://rhtr-admin:changethistosomethingelse@postgresql.city-of-losangeles.svc:5432/city-info').asUrlString(),
  SUPPORTED_TRANSPORTS,
  TRANSPORT_MODE: get('TRANSPORT_MODE').default('console').asEnum(Object.values(SUPPORTED_TRANSPORTS))
}
