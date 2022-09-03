// @ts-check

'use strict'

import EventEmitter from 'eventemitter3'

import {
  DIRECTIONS,
  DIRECTION_DOWN,
  DIRECTION_DOWN_LEFT,
  DIRECTION_DOWN_RIGHT,
  DIRECTION_LEFT,
  DIRECTION_NEUTRAL,
  DIRECTION_RIGHT,
  DIRECTION_UP,
  DIRECTION_UP_LEFT,
  DIRECTION_UP_RIGHT
} from './constants.js'

export class BaseInput extends EventEmitter {
  constructor () {
    super()
    this.id = null
    this.enabled = true
    this.dds = [] // Digital Directional State
    this.reset()
  }

  reset () {
    this.removeAllListeners()
  }

  /**
   * @param {string} action
   * @param {boolean} down
   * @param {number} [timestamp]
   * @returns
   */
  process (action, down, timestamp = undefined) {
    if (!this.enabled) {
      return
    }
    if (DIRECTIONS.indexOf(action) >= 0) {
      action = this.diagonalize(action, down)
    }
    this.emit('input', action, this, timestamp)
  }

  diagonalize (action, down) {
    var pressed = this.dds
    var index = pressed.indexOf(action)
    if (down) {
      if (index < 0) {
        pressed.push(action)
      }
    } else {
      pressed.splice(index, 1)
    }
    var len = pressed.length
    if (len === 0) {
      return DIRECTION_NEUTRAL // no directions pressed
    }
    var last = pressed[len - 1]
    if (len === 1) {
      return last // only one direction pressed
    }
    var previous = pressed[len - 2]
    // if-chain by priority
    if (last === DIRECTION_DOWN) {
      if (previous === DIRECTION_LEFT) return DIRECTION_DOWN_LEFT
      if (previous === DIRECTION_RIGHT) return DIRECTION_DOWN_RIGHT
      return DIRECTION_DOWN
    }
    if (last === DIRECTION_LEFT) {
      if (previous === DIRECTION_DOWN) return DIRECTION_DOWN_LEFT
      if (previous === DIRECTION_UP) return DIRECTION_UP_LEFT
      return DIRECTION_LEFT
    }
    if (last === DIRECTION_RIGHT) {
      if (previous === DIRECTION_DOWN) return DIRECTION_DOWN_RIGHT
      if (previous === DIRECTION_UP) return DIRECTION_UP_RIGHT
      return DIRECTION_RIGHT
    }
    if (last === DIRECTION_UP) {
      if (previous === DIRECTION_RIGHT) return DIRECTION_UP_RIGHT
      if (previous === DIRECTION_LEFT) return DIRECTION_UP_LEFT
      return DIRECTION_UP
    }
    console.warn('E-DDI-DG', pressed)
    return DIRECTION_NEUTRAL
  }
}
