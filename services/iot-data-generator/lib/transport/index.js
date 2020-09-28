'use strict'

const log = require('barelog')
const console = require('./console')
const kafka = require('./kafka')
const http = require('./http')
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
  } else if (TRANSPORT_MODE === SUPPORTED_TRANSPORTS.CONSOLE) {
    log('using console transport')
    transport = console()
    return transport
  } else if (TRANSPORT_MODE === SUPPORTED_TRANSPORTS.HTTP) {
    log('using http transport')
    transport = http()
    return transport
  } else {
    throw new Error(`Invalid TRANSPORT_MODE value found in the environment: "${transport}"`)
  }
}
