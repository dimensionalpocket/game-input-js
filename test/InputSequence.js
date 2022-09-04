// @ts-check

'use strict'

import { expect } from '@dimensionalpocket/development'
import { Timer } from '@dimensionalpocket/timer/src/Timer.js'
import { InputSequence } from '../src/InputSequence.js'
import {
//  ALL_INPUTS,
  BUTTON_A,
  BUTTON_B,
  // BUTTON_C,
  // DIRECTION_DOWN_LEFT,
  DIRECTION_LEFT,
  // DIRECTION_UP_LEFT,
  DIRECTION_DOWN,
  DIRECTION_DOWN_RIGHT,
  DIRECTION_RIGHT,
  DIRECTION_NEUTRAL,
  DIRECTION_DOWN_LEFT,
  ALL_INPUTS
  // DIRECTION_UP_RIGHT,
  // DIRECTION_UP
} from '../src/constants.js'

describe('InputSequence', function () {
  before(function () {
    this.timer = new Timer()
  })

  describe('#register', function () {
    before(function () {
      this.subject = new InputSequence()
      this.subject.register(DIRECTION_DOWN)
      this.subject.register(DIRECTION_DOWN_RIGHT)
      this.subject.register(DIRECTION_RIGHT)
      this.subject.register(BUTTON_A)

      // @ts-ignore
      this.subject.timer = this.timer
    })

    it('registers the correct amount of steps', function () {
      expect(this.subject.steps).to.have.length(4)
    })

    it('assigns steps in correct order', function () {
      var steps = this.subject.steps
      expect(steps[0].previous).to.equal(null)
      expect(steps[0].next).to.equal(steps[1])
      expect(steps[1].previous).to.equal(steps[0])
      expect(steps[1].next).to.equal(steps[2])
      expect(steps[2].previous).to.equal(steps[1])
      expect(steps[2].next).to.equal(steps[3])
      expect(steps[3].previous).to.equal(steps[2])
      expect(steps[3].next).to.equal(null)
    })
  })

  describe('#registerAny', function () {
    before(function () {
      this.subject = new InputSequence()
      this.subject.registerAny([DIRECTION_LEFT, DIRECTION_DOWN_LEFT])
    })

    it('register steps watching given inputs', function () {
      var step = this.subject.steps[0]
      for (var i of ALL_INPUTS) {
        if (i === DIRECTION_LEFT || i === DIRECTION_DOWN_LEFT) {
          expect(step.watching[i]).to.equal(true)
        } else {
          expect(step.watching[i]).to.equal(false)
        }
      }
    })
  })

  describe('#feed', function () {
    before(function () {
      this.subject = new InputSequence()
      this.subject.timer = this.timer
      this.subject.register(DIRECTION_DOWN)
      this.subject.register(DIRECTION_DOWN_RIGHT)
      this.subject.register(DIRECTION_RIGHT)
      this.subject.register(BUTTON_A)
    })

    context('without steps', function () {
      before(function () {
        this.subject = new InputSequence()
        this.subject.timer = this.timer
      })

      it('returns false', function () {
        expect(this.subject.feed(DIRECTION_DOWN)).to.equal(false)
        expect(this.subject.feed(DIRECTION_DOWN_RIGHT)).to.equal(false)
        expect(this.subject.feed(DIRECTION_RIGHT)).to.equal(false)
        expect(this.subject.feed(BUTTON_A)).to.equal(false)
      })
    })

    it('returns true when it completes', function () {
      var result
      var steps = this.subject.steps
      this.timer.counter = 1
      expect(this.subject.next).to.equal(steps[0])
      result = this.subject.feed(DIRECTION_DOWN)
      expect(result).to.equal(false)
      expect(this.subject.next).to.equal(steps[1])
      this.timer.counter = 2
      result = this.subject.feed(DIRECTION_DOWN_RIGHT)
      expect(result).to.equal(false)
      expect(this.subject.next).to.equal(steps[2])
      this.timer.counter = 3
      result = this.subject.feed(DIRECTION_RIGHT)
      expect(result).to.equal(false)
      expect(this.subject.next).to.equal(steps[3])
      this.timer.counter = 4
      result = this.subject.feed(BUTTON_B) // dirty input, shouldn't reset sequence
      expect(result).to.equal(false)
      expect(this.subject.next).to.equal(steps[3])
      this.timer.counter = 5
      result = this.subject.feed(BUTTON_A)
      expect(result).to.equal(true)
      expect(this.subject.next).to.equal(steps[0]) // resets sequence
    })

    it('returns false if any of the steps expire', function () {
      var result
      var steps = this.subject.steps
      this.timer.counter = 1
      expect(this.subject.next).to.equal(steps[0])
      result = this.subject.feed(DIRECTION_DOWN)
      expect(result).to.equal(false)
      expect(this.subject.next).to.equal(steps[1])
      this.timer.counter = 35 // makes previous step expire
      result = this.subject.feed(DIRECTION_DOWN_RIGHT)
      expect(result).to.equal(false)
      expect(this.subject.next).to.equal(steps[0]) // reset sequence
      this.timer.counter = 36
      result = this.subject.feed(DIRECTION_RIGHT)
      expect(result).to.equal(false)
      expect(this.subject.next).to.equal(steps[0])
      this.timer.counter = 37
      result = this.subject.feed(BUTTON_A)
      expect(result).to.equal(false)
      expect(this.subject.next).to.equal(steps[0])
    })

    context('when registerAny is used', function () {
      before(function () {
        this.subject = new InputSequence()
        this.subject.registerAny([DIRECTION_LEFT, DIRECTION_DOWN_LEFT])
        this.subject.register(DIRECTION_RIGHT)
        this.subject.register(BUTTON_A)

        // @ts-ignore
        this.subject.timer = this.timer
      })

      it('works with the given inputs', function () {
        var result
        this.timer.counter = 1
        this.subject.feed(DIRECTION_DOWN_LEFT)
        this.timer.counter = 2
        this.subject.feed(DIRECTION_RIGHT)
        this.timer.counter = 3
        result = this.subject.feed(BUTTON_A)
        expect(result).to.equal(true)
        this.timer.counter = 4
        this.subject.feed(DIRECTION_LEFT)
        this.timer.counter = 5
        this.subject.feed(DIRECTION_RIGHT)
        this.timer.counter = 6
        result = this.subject.feed(BUTTON_A)
        expect(result).to.equal(true)
      })
    })

    context('when pristine', function () {
      before(function () {
        this.subject.pristine = true
      })

      after(function () {
        this.subject.pristine = false
      })

      it('returns false when dirty input is present', function () {
        var result
        var steps = this.subject.steps
        this.timer.counter = 1
        expect(this.subject.next).to.equal(steps[0])
        result = this.subject.feed(DIRECTION_DOWN)
        expect(result).to.equal(false)
        expect(this.subject.next).to.equal(steps[1])
        this.timer.counter = 2
        result = this.subject.feed(DIRECTION_DOWN_RIGHT)
        expect(result).to.equal(false)
        expect(this.subject.next).to.equal(steps[2])
        this.timer.counter = 3
        result = this.subject.feed(DIRECTION_RIGHT)
        expect(result).to.equal(false)
        expect(this.subject.next).to.equal(steps[3])
        this.timer.counter = 4
        result = this.subject.feed(DIRECTION_DOWN) // dirty input equal to first step
        expect(result).to.equal(false)
        expect(this.subject.next).to.equal(steps[1])
        this.timer.counter = 5
        result = this.subject.feed(BUTTON_B) // dirty input different from first step
        expect(result).to.equal(false)
        expect(this.subject.next).to.equal(steps[0])
        this.timer.counter = 6
        result = this.subject.feed(BUTTON_A)
        expect(result).to.equal(false)
        expect(this.subject.next).to.equal(steps[0])
      })

      it('returns true without dirty inputs', function () {
        var result
        var steps = this.subject.steps
        this.timer.counter = 1
        expect(this.subject.next).to.equal(steps[0])
        result = this.subject.feed(DIRECTION_DOWN)
        expect(result).to.equal(false)
        expect(this.subject.next).to.equal(steps[1])
        this.timer.counter = 2
        result = this.subject.feed(DIRECTION_DOWN_RIGHT)
        expect(result).to.equal(false)
        expect(this.subject.next).to.equal(steps[2])
        this.timer.counter = 3
        result = this.subject.feed(DIRECTION_RIGHT)
        expect(result).to.equal(false)
        expect(this.subject.next).to.equal(steps[3])
        this.timer.counter = 4
        result = this.subject.feed(BUTTON_A)
        expect(result).to.equal(true)
        expect(this.subject.next).to.equal(steps[0]) // resets sequence
      })
    })
  })

  describe('special cases', function () {
    describe('double tap same direction', function () {
      before(function () {
        this.subject = new InputSequence()
        // @ts-ignore
        this.subject.timer = this.timer
        this.subject.register(DIRECTION_RIGHT)
        this.subject.register(DIRECTION_NEUTRAL)
        this.subject.register(DIRECTION_RIGHT)
      })

      it('returns true with correct input', function () {
        var result
        this.timer.counter = 1
        this.subject.feed(DIRECTION_RIGHT)
        this.timer.counter = 2
        this.subject.feed(DIRECTION_NEUTRAL)
        this.timer.counter = 3
        result = this.subject.feed(DIRECTION_RIGHT)
        expect(result).to.equal(true)
      })
    })
  })
})
