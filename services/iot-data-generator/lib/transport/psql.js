'use strict'

const { Pool } = require('pg')
const log = require('barelog')
const { PG_CONNECTION_STRING } = require('../config')

module.exports = async function getPgTransport () {
  const connectionString = PG_CONNECTION_STRING

  log('connecting to psql using: %s', connectionString)

  const pool = new Pool({
    connectionString
  })

  await pool.connect()

  return {
    /**
     * Inserts a meter update in the meter status table
     * @param {Number} meterId
     * @param {Number} timestamp
     * @param {String} status
     */
    insertMeterUpdate: async (meterId, timestamp, status) => {
      const insertParams = [meterId, new Date(timestamp).toJSON(), status]
      try {
        await pool.query(
          'INSERT INTO meter_status_evals50 (meter_id, timestamp, status_text) VALUES ($1, $2, $3)',
          insertParams
        )
      } catch (e) {
        log('meter status insert failed for: ', insertParams)
        log(e)
      }
    },

    /**
     * Inserts a meter update in the meter status table
     * @param {Number} junctionId
     * @param {Number} timestamp
     * @param {Number} status
     * @param {Number} status
     */
    insertJunctionUpdate: async (junctionId, timestamp, ns, ew) => {
      const insertParams = [junctionId, new Date(timestamp).toJSON(), ns, ew]
      try {
        await pool.query(
          'INSERT INTO junction_status_evals50 (junction_id, timestamp, count_ns, count_ew) VALUES ($1, $2, $3, $4)',
          insertParams
        )
      } catch (e) {
        log('junction status insert failed for: ', insertParams)
        log(e)
      }
    }
  }
}
