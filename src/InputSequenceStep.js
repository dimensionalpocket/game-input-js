// @ts-check

'use strict'

import { InputState } from './InputState.js'

export class InputSequenceStep {
  /**
   *
   * @param {object} options
   */
  constructor (options = null) {
    this.previous = null // previous step, set by sequence
    this.next = null // next step, set by sequence
    this.timer = null
    this.frame = null // frame number this step completed at

    // in-between frames until step expires
    this.expiration = 10

    // multi-press buffer
    this.buffer = 2

    // how long the input should be held down, in frames
    this.charge = 0

    this.watching = new InputState(false)
    this.held = new InputState(false)

    this.any = true // false if this step is multipress

    this.configure(options)
  }

  /**
   * @param {object} options
   */
  configure (options = null) {
    if (options == null) return

    if (options.expiration != null) this.expiration = options.expiration
    if (options.buffer != null) this.buffer = options.buffer
    if (options.charge != null) this.charge = options.charge
  }

  watch (event) {
    this.watching[event] = true
  }

  unwatch (event) {
    this.watching[event] = false
  }

  feed (event) {
    var watching = this.watching[event]
    if (watching) {
      this.frame = this.timer.counter
    }
    if (this.any) {
      return watching
    }
    // TODO - multipress
    return false
  }

  valid () {
    var frame = this.frame
    if (!frame && frame !== 0) {
      return false
    }
    var timer = this.timer
    if (!timer) {
      return false
    }
    var delta = timer.counter - frame
    var charge = this.charge
    if (charge > 0) {
      // when charge is present, step never expires
      return delta >= charge
    }
    return delta < this.expiration
  }

  clear () {
    this.held.clear(false)
    this.watching.clear(false)
  }
}
