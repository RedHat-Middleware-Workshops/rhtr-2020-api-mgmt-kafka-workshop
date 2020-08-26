'use strict'

const assert = require('assert')

class Junction {
  /**
   * Junction properties
   * @param {Object} props
   * @param {string} props.id
   * @param {string} props.name
   * @param {number} props.latitude
   * @param {number} props.longitude
   */
  constructor (props) {
    assert(typeof props.id === 'number', 'Junction ID must be a number')
    assert(typeof props.latitude === 'number', 'Junction lat/long must be a number')
    assert(typeof props.longitude === 'number', 'Junction lat/long must be a number')
    assert(typeof props.name === 'string', 'Junction name must be a string')

    this.props = props
    this.weight = undefined
  }

  get id () {
    return this.props.id
  }

  /**
   * Returns a JSON object containing the junction data
   */
  toJSON () {
    return {
      ...this.props
    }
  }
}

module.exports = Junction
