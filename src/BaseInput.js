// @ts-check

'use strict'

import { DIRECTIONS } from './constants.js'

export class BaseInput {
  constructor () {
    this.id = null
    this.enabled = true
    this.dds = [] // Digital Directional State
    this.reset()
  }

  reset () {
    this.dispatch = unassignedFn
  }

  process (action, down) {
    if (!this.enabled) {
      return
    }
    if (DIRECTIONS.indexOf(action) >= 0) {
      action = this.diagonalize(action, down)
    }
    this.dispatch(this, action)
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
      return '5' // no directions pressed
    }
    var last = pressed[len - 1]
    if (len === 1) {
      return last // only one direction pressed
    }
    var previous = pressed[len - 2]
    // if-chain by priority
    if (last === '2') {
      if (previous === '4') return '1'
      if (previous === '6') return '3'
      return '2'
    }
    if (last === '4') {
      if (previous === '2') return '1'
      if (previous === '8') return '7'
      return '4'
    }
    if (last === '6') {
      if (previous === '2') return '3'
      if (previous === '8') return '9'
      return '6'
    }
    if (last === '8') {
      if (previous === '6') return '9'
      if (previous === '4') return '7'
      return '8'
    }
    console.warn('E-DDI-DG', pressed)
    return '5'
  }
}

/* istanbul ignore next */
function unassignedFn (_inputInstance, _inputEvent) {}
