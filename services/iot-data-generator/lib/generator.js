'use strict'

const log = require('barelog')
const weightedRandom = require('weighted-random')
const getTransport = require('./transport')
const Meter = require('./classes/meter')
const { SEND_INTERVAL_MAX_MS, SEND_COUNT_MIN, SEND_COUNT_MAX} = require('./config')

// These are the states that a meter can be in. They also have a weight
// assigned that's used to create a distribution of states
const meterStateWeights = [
  {
    weight: 0.55,
    text: Meter.STATES.OCCUPIED
  },
  {
    weight: 0.25,
    text: Meter.STATES.AVAILABLE
  },
  {
    weight: 0.1,
    text: Meter.STATES.UNKNOWN
  },
  {
    weight: 0.1,
    text: Meter.STATES.OUT_OF_SERVICE
  }
]

/**
 * Creates a generator instance. Currently this uses internal timers to
 * update meter and junction state information
 * @param {Junction[]} junctionList
 * @param {Meter[]} meterList
 */
module.exports = async function createGenerator (junctionList, meterList) {
  log('creating data generator')

  let junctionIdx = 0

  const transport = await getTransport()

  // Assign random weights to junctions on startup
  assignJunctionWeights(junctionList)

  // Update a batch of junctions every SEND_INTERVAL_MAX_MS
  // setInterval(() => {
  //   const batchSize = getRandomInt(SEND_COUNT_MIN, SEND_COUNT_MAX)
  //   const junctions = junctionList.slice(junctionIdx, junctionIdx + batchSize)
  //   junctionIdx += batchSize

  //   log(`updating ${batchSize} junctions in this run`)

  //   if (junctionIdx >= junctionList.length) {
  //     junctionIdx = 0
  //   }

  //   junctions.forEach((j) => {
  //     const state = generateStateForJunction(j)

  //     transport.insertJunctionUpdate(
  //       state.junctionId, state.timestamp, state.counts.ew, state.counts.ns
  //     )
  //   })
  // }, SEND_INTERVAL_MAX_MS)


  const sendMeterUpdate = () => {
    const meterToUpdate = meterList[getRandomInt(0, meterList.length - 1)]

    // Generate a fake update event
    const { timestamp, status, meterId } = generateStateForMeter(meterToUpdate)

    // Record the new status on the meter itself
    meterToUpdate.status = status

    // Write it to the chosen transport
    log('sending an update for meter:', meterId)
    transport.insertMeterUpdate(meterId, timestamp, status)

    // Queue the next update to send 500ms to SEND_INTERVAL_MAX_MS from now
    setTimeout(sendMeterUpdate, getRandomInt(500, SEND_INTERVAL_MAX_MS))
  }

  sendMeterUpdate()
}

/**
 * Generate a state update for the given junction
 * @param {Junction} j
 */
function generateStateForJunction (j) {
  const min = j.weight * 0.20
  const timestamp = getTimestamp()
  const junctionId = j.uuid
  const counts = {
    ew: Math.round(Math.max(min, Math.random() * j.weight)),
    ns: Math.round(Math.max(min, Math.random() * j.weight))
  }

  return {
    junctionId, timestamp, counts
  }
}

/**
 * Generate a state update for the given meter
 * @param {Meter} m
 */
function generateStateForMeter (m) {
  const timestamp = getTimestamp()
  const status = getWeightedRandomMeterStatus().text
  const meterId = m.uuid

  // A side-effect, yuck!
  m.status = status

  return { timestamp, status, meterId }
}

function getWeightedRandomMeterStatus () {
  const selectionIdx = weightedRandom(meterStateWeights.map(val => val.weight))
  return meterStateWeights[selectionIdx]
}

/**
 * We need to weight junctions in batches to simulate traffic hotspots
 * This function will assign a weight of W to N junctions repeatedly
 * until all junctions have a weight
 * @param {Junction[]} junctions
 */
function assignJunctionWeights (junctions) {
  log('assigning weights to junctions')
  let i = 0

  while (i < junctions.length) {
    // Number of junctions for this batch. Using a random range creates
    // busy and not so busy clusters of junctions
    const n = getRandomInt(25, 75)
    // Scale for weight, or "busyness" of junctions
    const w = getRandomInt(2, 75)

    for (let j = 0; j <= n; j++) {
      const jct = junctions[i + j]
      if (jct) {
        jct.weight = w
      }
    }

    i += n
  }
}

/**
 * Return an integer in the given range
 * @param {Number} min
 * @param {Number} max
 */
function getRandomInt (min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)

  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Returns seconds since epoch timestamps
 */
function getTimestamp () {
  return Math.round(Date.now() / 1000)
}
