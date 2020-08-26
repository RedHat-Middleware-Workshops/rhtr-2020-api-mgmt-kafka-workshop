'use strict'

const log = require('barelog')
const psql = require('./psql')
const console = require('./console')
const kafka = require('./kafka')
const amqp = require('./kafka')
const { TRANSPORT_MODE, SUPPORTED_TRANSPORTS } = require('../config')

// We cache the chosen transport object after the initial setup to
// prevent an excessive number of connections being made to it
let transport = null
/**
 * Returns a transport that will direct junction and meter updates
 * to a specific medium, e.g console.log or kafka topics
 */
module.exports = function getTransport () {
  if (transport) return transport

  if (TRANSPORT_MODE === SUPPORTED_TRANSPORTS.KAFKA) {
    log('using kafka transport')
    transport = kafka()
    return transport
  } else if (TRANSPORT_MODE === SUPPORTED_TRANSPORTS.PSQL) {
    log('using psql transport')
    transport = psql()
    return transport
  } else if (TRANSPORT_MODE === SUPPORTED_TRANSPORTS.AQMP) {
    log('using amqp transport')
    transport = amqp()
    return transport
  } else {
    log('using console transport')
    transport = console()
    return transport
  }
}
