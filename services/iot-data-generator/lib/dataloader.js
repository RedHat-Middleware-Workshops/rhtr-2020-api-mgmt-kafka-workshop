'use strict'

const { resolve } = require('path')
const csv = require('csvtojson')
const log = require('barelog')
const Junction = require('./classes/junction')
const Meter = require('./classes/meter')

/**
 * Reads data from CSV, creates Junction and Meter instances, and loads
 * this data into the MongoDB instance
 */
module.exports = async function createDataloader () {
  const junctions = await loadJunctions()
  const meters = await loadMeters()

  return {
    getMeters: () => meters,
    getJunctions: () => junctions
  }
}

/**
 * Parses the CSV data in junction_info.csv to JSON and instantiates
 * Junction instances using this data.
 * @returns {Junction[]}
 */
async function loadJunctions () {
  log('reading junction csv and instantiating Junction instances')
  const csvJunctionData = await csv().fromFile(
    resolve(__dirname, '../data/junction_info.csv')
  )

  return csvJunctionData.map((data) => {
    return new Junction({
      uuid: data.uuid,
      name: data.name,
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude)
    })
  })
}

/**
 * Parses the CSV data in meter_info.csv to JSON and instantiates
 * Meter instances using this data.
 * @returns {Meter[]}
 */
async function loadMeters () {
  log('reading meter csv and instantiating Junction instances')
  const csvMeterData = await csv().fromFile(
    resolve(__dirname, '../data/meter_info.csv')
  )

  return csvMeterData.map((data) => {
    return new Meter({
      uuid: data.uuid,
      address: data.address,
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude)
    })
  })
}
