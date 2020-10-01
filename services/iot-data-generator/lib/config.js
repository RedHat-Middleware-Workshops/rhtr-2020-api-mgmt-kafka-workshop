'use strict'

const { get } = require('env-var')

const SUPPORTED_TRANSPORTS = {
  CONSOLE: 'console',
  KAFKA: 'kafka',
  HTTP: 'http'
}

module.exports = {
  HTTP_PORT: get('HTTP_PORT').default('8080').asPortNumber(),
  KAFKA_HOST: get('KAFKA_HOST').default('iot-cluster-kafka-brokers:9092').asString(),
  HTTP_HOST: get('HTTP_HOST').asString(),
  SUPPORTED_TRANSPORTS,
  TRANSPORT_MODE: get('TRANSPORT_MODE').default('console').asEnum(Object.values(SUPPORTED_TRANSPORTS))
}
