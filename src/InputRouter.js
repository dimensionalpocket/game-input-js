// @ts-check

'use strict'

import { REVERSIBLE_DIRECTIONS, OPPOSITES } from './constants.js'

export class InputRouter {
  constructor () {
    this.flipped = false // when `true`, flips input horizontally
    this.sequences = []
    this._timer = null
  }

  set timer (timer) {
    this._timer = timer
    for (var sequence of this.sequences) {
      sequence.timer = timer
    }
  }

  // get timer () {
  //   return this._timer
  // }

  register (sequence) {
    this.sequences.push(sequence)
    this.sequences.sort(sortByPriority)
  }

  feed (e) {
    var event = e
    // var start = Date.now()
    var sequence
    var captured = false
    if (REVERSIBLE_DIRECTIONS.indexOf(event) >= 0) {
      if (this.flipped) {
        event = OPPOSITES[event]
      }
    }
    for (sequence of this.sequences) {
      captured = sequence.feed(event)
      if (captured) {
        captured = sequence
        break
      }
    }
    // console.log('[InputRouter]', Date.now() - start)
    return captured
  }
}

function sortByPriority (a, b) {
  return b.priority - a.priority
}
