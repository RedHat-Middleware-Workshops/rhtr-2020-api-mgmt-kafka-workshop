'use strict'

const kafka = require('kafka-node')
const log = require('barelog')
const { KAFKA_HOST } = require('../config')

module.exports = function getKafkaTransport () {
  return new Promise((resolve, reject) => {
    const kafkaHost = KAFKA_HOST
    const client = new kafka.KafkaClient({
      kafkaHost
    })
    const producer = new kafka.Producer(client)

    producer.on('ready', () => {
      log(`kafka targeting host ${kafkaHost} is ready`)

      resolve({
        /**
         * Sends a meter status update to the topic
         * @param {Number} meterId
         * @param {Number} timestamp
         * @param {String} status
         */
        insertMeterUpdate: async (meterId, timestamp, status) => {
          const messages = JSON.stringify({
            meterId,
            timestamp,
            status
          })

          producer.send([{ topic: 'meters', messages }], (err) => {
            if (err) {
              log('error sending meter update', err)
            }
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
          const messages = JSON.stringify({
            junctionId,
            counts: {
              ns,
              ew
            },
            timestamp
          })

          producer.send([{ topic: 'junctions', messages }], (err) => {
            if (err) {
              log('error sending junction update', err)
            }
          })
        }
      })
    })

    producer.on('error', (err) => {
      log('kafka producer error:', err)

      // If the promise already resolved then this is ignored
      reject(err)
    })
  })
}
