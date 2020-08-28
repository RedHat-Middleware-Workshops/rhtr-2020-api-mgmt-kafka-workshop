'use strict'

const { resolve } = require('path')
const csv = require('csvtojson')
const log = require('barelog')
const MongoClient = require('mongodb').MongoClient
const Junction = require('./classes/junction')
const Meter = require('./classes/meter')
const { MONGO_CONNECTION_STRING } = require('./config')

/**
 * Reads data from CSV, creates Junction and Meter instances, and loads
 * this data into the MongoDB instance
 */
module.exports = async function createDataloader () {
  const junctions = await loadJunctions()
  const meters = await loadMeters()
  const client = await MongoClient.connect(MONGO_CONNECTION_STRING)
  const db = client.db('city-info')

  await insertJunctions(junctions, db)
  await insertMeters(meters, db)

  return {
    getMeters: () => meters,
    getJunctions: () => junctions
  }
}

/**
 * Seed the database with all junctions
 * @param {Junction[]} junctions
 * @param {MongoClient.db}
 */
async function insertJunctions (junctions, db) {
  const collection = db.collection('junction')
  log('drop existing junctions collection')
  try {
    await collection.drop()
  } catch (e) {
    log(e)
  }
  log('inserting junctions into mongodb')
  await collection.insertMany(junctions.map(j => j.toJSON()), { ordered: true })
}

/**
 * Seed the database with all meters
 * @param {Meter[]} meters
 * @param {MongoClient.db}
 */
async function insertMeters (meters, db) {
  log('inserting meters into mongodb')
  const collection = db.collection('meter')
  try {
    await collection.drop()
  } catch (e) {
    log(e)
  }
  await collection.insertMany(meters.map(m => {
    const data = m.toJSON()
    return {
      uuid: data.uuid,
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude
    }
  }), { ordered: true })
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
      name: data.junction_name,
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
