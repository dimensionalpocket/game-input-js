'use strict'

import { ALL_INPUTS } from './constants'

export class InputState {
  constructor (initial) {
    if (initial === undefined) {
      initial = null
    }
    this.initial = initial
    this.clear(initial)
  }

  clear (value) {
    var v = (value === undefined) ? this.initial : value
    for (var i of ALL_INPUTS) {
      this[i] = v
    }
  }
}
