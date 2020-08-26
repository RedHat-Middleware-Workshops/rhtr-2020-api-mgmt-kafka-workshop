'use strict'

const assert = require('assert')

class Meter {

  static STATES = {
    OCCUPIED: 'occupied',
    AVAILABLE: 'available',
    UNKNOWN: 'unknown',
    OUT_OF_SERVICE: 'out-of-service'
  }

  /**
   * Meter properties
   * @param {Object} props
   * @param {string} props.uuid
   * @param {string} props.address
   * @param {number} props.latitude
   * @param {number} props.longitude
   */
  constructor (props) {
    assert(typeof props.uuid === 'string', 'Meter uuid must be a string')
    assert(typeof props.latitude === 'number', 'Meter lat/long must be a number')
    assert(typeof props.longitude === 'number', 'Meter lat/long must be a number')
    assert(typeof props.address === 'string', 'Meter address must be a string')

    this.props = props
    this.status = Meter.STATES.AVAILABLE
  }

  get uuid () {
    return this.props.uuid
  }

  /**
   * Returns a JSON object containing the meter data
   */
  toJSON () {
    return {
      ...this.props,
      status: this.status
    }
  }
}

module.exports = Meter
