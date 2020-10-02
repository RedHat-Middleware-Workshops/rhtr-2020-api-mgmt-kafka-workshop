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
  BRIDGE_HTTP_HOST: get('BRIDGE_HTTP_HOST').asString(),
  SUPPORTED_TRANSPORTS,
  TRANSPORT_MODE: get('TRANSPORT_MODE').default('console').asEnum(Object.values(SUPPORTED_TRANSPORTS)),
  SEND_COUNT_MIN: get('SEND_COUNT_MIN').default('2').asIntPositive(),
  SEND_COUNT_MAX: get('SEND_COUNT_MIN').default('8').asIntPositive(),
  SEND_INTERVAL_MS: get('SEND_INTERVAL_MS').default('1500').asIntPositive()
}
