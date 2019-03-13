'use strict'

import { InputState } from './InputState'

export class InputSequenceStep {
  constructor () {
    this.previous = null // previous step, set by sequence
    this.next = null // next step, set by sequence
    this.counter = null
    this.frame = null // frame number this step completed at
    this.expiration = 30 // in-between frames until step expires
    this.buffer = 5 // multi-press buffer
    this.charge = 0 // in frames
    this.watching = new InputState(false)
    this.held = new InputState(false)
    this.any = true // false if this step is multipress
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
      this.frame = this.counter.current
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
    var counter = this.counter
    if (!counter) {
      return false
    }
    var delta = counter.current - frame
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
