// @ts-check

'use strict'

import { InputSequenceStep } from './InputSequenceStep.js'

export class InputSequence {
  constructor (id) {
    this.id = id
    this.steps = []
    this.next = null // next step
    this.priority = 0 // skill priority in InputRouter (higher runs first)
    this.pristine = false
    this.resetOnFlip = false
    this._timer = null
  }

  set timer (timer) {
    this._timer = timer
    for (var step of this.steps) {
      step.timer = timer
    }
  }

  // get timer () {
  //   return this._timer
  // }

  /**
   * Returns true if sequence completes.
   *
   * @param {string} event
   */
  feed (event) {
    var next = this.next

    if (!next) {
      return false
    }

    var previous = next.previous
    if (previous && previous.valid() === false) {
      // previous step has expired
      this.reset()
      next = this.next
    }

    var fed = next.feed(event)
    if (!fed) {
      if (this.pristine) {
        // dirty input: reset sequence
        this.reset()
        next = this.next // set to first step by reset()
        // check if dirty input equals first input
        // if true, will fall out of the if-else block and move to second step
        fed = next.feed(event)
        if (!fed) {
          return false
        }
      } else {
        return false
      }
    }

    if (next.next) {
      this.next = next.next
      return false // moved on to next step, but didn't complete
    }

    this.reset()
    return true // sequence complete!
  }

  /**
   * @param {string} event
   * @param {object} options
   */
  register (event, options = null) {
    var step = new InputSequenceStep(options)

    step.watch(event)
    this.registerStep(step)
  }

  /**
   * @param {Array<string>} events
   */
  registerAny (events, options = null) {
    var step = new InputSequenceStep(options)
    for (var event of events) {
      step.watch(event)
    }
    step.any = true
    this.registerStep(step)
  }

  // registerMultiple (events, options = null) {
  //   var step = new InputSequenceStep(options)
  //   for (var event of events) {
  //     step.watch(event)
  //   }
  //   step.any = false
  //   this.registerStep(step)
  // }

  registerStep (step) {
    step.timer = this._timer
    this.steps.push(step)
    var l = this.steps.length
    if (l === 1) {
      this.next = step
      return
    }
    var previous = this.steps[l - 2]
    step.previous = previous
    previous.next = step
  }

  reset () {
    // returns to first step
    this.next = this.steps[0]
  }
}
