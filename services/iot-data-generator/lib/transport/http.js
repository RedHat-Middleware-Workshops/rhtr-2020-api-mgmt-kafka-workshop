'use strict'

const got = require('got')
const log = require('barelog')
const { HTTP_HOST } = require('../config')

module.exports = function getKafkaTransport() {
  return new Promise((resolve) => {
    if (!HTTP_HOST) {
      log('TRANSPORT_MODE is set to use "http", but the HTTP_HOST environment variable is missing. Please set it. For example "https://api.acme.com/"')
      process.exit(1)
    }

    log('creating http transport using host:', HTTP_HOST)

    /**
     * Creates a POST body compliant with the Kafka HTTP Bridge format.
     * @param {String} key
     * @param {Array|Object} data
     */
    function createKafkaPostBodyWithData (key, data) {
      return {
        records: [
          {
            key,
            data
          }
        ]
      }
    }

    resolve({
      /**
       * Sends a meter status update to the topic
       * @param {Number} meterId
       * @param {Number} timestamp
       * @param {String} status
       */
      insertMeterUpdate: async (meterId, timestamp, status) => {
        const body = createKafkaPostBodyWithData(meterId, {
          meterId,
          timestamp,
          status
        })

        const u = new URL('/topics/meters', HTTP_HOST)

        await got.post(u.toString(), {
          headers: {
            'content-type': 'application/vnd.kafka.json.v2+json'
          },
          body: JSON.stringify(body),
          responseType: 'json'
        })
      },

      /**
       * Send a junction status update to the topic
       * @param {Number} junctionId
       * @param {Number} timestamp
       * @param {Number} status
       * @param {Number} status
       */
      insertJunctionUpdate: async (junctionId, timestamp, ns, ew) => {
        const body = createKafkaPostBodyWithData(junctionId, {
          junctionId,
          counts: {
            ns,
            ew
          },
          timestamp
        })

        const u = new URL('/topics/junctions', HTTP_HOST)

        await got.post(u.toString(), {
          headers: {
            'content-type': 'application/vnd.kafka.json.v2+json'
          },
          body: JSON.stringify(body),
          responseType: 'json'
        })
      }
    })
  })
}
