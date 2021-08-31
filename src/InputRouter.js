'use strict'

import { REVERSIBLE_DIRECTIONS, OPPOSITES } from './constants.js'

export class InputRouter {
  constructor () {
    this.fighter = null // fighter.orientation will be used to flip input horizontally
    this.sequences = []
    this._counter = null
  }

  set counter (counter) {
    this._counter = counter
    for (var sequence of this.sequences) {
      sequence.counter = counter
    }
  }

  // get counter () {
  //   return this._counter
  // }

  register (sequence) {
    this.sequences.push(sequence)
    this.sequences.sort(sortByPriority)
  }

  feed (event) {
    // var start = Date.now()
    var sequence
    var captured = false
    if (REVERSIBLE_DIRECTIONS.indexOf(event) >= 0) {
      var fighter = this.fighter
      if (fighter && fighter.orientation === -1) {
        event = OPPOSITES[event]
      }
    }
    for (sequence of this.sequences) {
      captured = sequence.feed(event)
      if (captured) {
        captured = sequence.id
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
