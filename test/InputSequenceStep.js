// @ts-check

'use strict'

import { expect } from '@dimensionalpocket/development'
import { Timer } from '@dimensionalpocket/timer/src/Timer.js'
import { InputSequenceStep } from '../src/InputSequenceStep.js'
import {
  ALL_INPUTS,
  BUTTON_A,
  BUTTON_B,
  BUTTON_C,
  DIRECTION_DOWN_LEFT,
  DIRECTION_LEFT,
  DIRECTION_UP_LEFT,
  DIRECTION_DOWN,
  DIRECTION_DOWN_RIGHT,
  DIRECTION_RIGHT,
  DIRECTION_UP_RIGHT,
  DIRECTION_UP,
  DIRECTION_NEUTRAL
} from '../src/constants.js'

describe('InputSequenceStep', function () {
  before(function () {
    this.timer = new Timer()
    this.subject = new InputSequenceStep()
    this.subject.timer = this.timer
  })

  describe('constructor', function () {
    it('sets watcher flags for all inputs', function () {
      for (var i of ALL_INPUTS) {
        expect(this.subject.watching[i]).to.equal(false)
      }
    })
  })

  describe('#configure', function () {
    it('sets expiration', function () {
      var step = new InputSequenceStep()
      step.configure({ expiration: 5 })
      expect(step.expiration).to.eq(5)
    })

    it('sets buffer', function () {
      var step = new InputSequenceStep()
      step.configure({ buffer: 6 })
      expect(step.buffer).to.eq(6)
    })

    it('sets charge', function () {
      var step = new InputSequenceStep()
      step.configure({ charge: 7 })
      expect(step.charge).to.eq(7)
    })

    it('does not change current values when given null', function () {
      var step = new InputSequenceStep({ expiration: 1, buffer: 2, charge: 3 })
      step.configure()
      expect(step.expiration).to.eq(1)
      expect(step.buffer).to.eq(2)
      expect(step.charge).to.eq(3)
    })
  })

  describe('#watch/#unwatch', function () {
    it('sets watcher flag of given event to true or false', function () {
      expect(this.subject.watching[BUTTON_A]).to.equal(false)
      this.subject.watch(BUTTON_A)
      expect(this.subject.watching[BUTTON_A]).to.equal(true)
      this.subject.unwatch(BUTTON_A)
      expect(this.subject.watching[BUTTON_A]).to.equal(false)
    })
  })

  describe('#feed', function () {
    context('when any=false (multipress)', function () {
      before(function () {
        this.subject.clear()
        this.subject.any = false
        this.subject.watch(BUTTON_A)
        this.subject.watch(BUTTON_B)
      })

      it('sets the current frame number', function () {
        this.timer.counter = 1
        this.subject.feed(BUTTON_A)
        expect(this.subject.frame).to.equal(1)
        this.timer.counter = 2
        this.subject.feed(BUTTON_B)
        expect(this.subject.frame).to.equal(2)
        this.timer.counter = 3
        this.subject.feed(BUTTON_C) // not watched
        expect(this.subject.frame).to.equal(2)
      })

      it('returns false (PENDING)', function () {
        expect(this.subject.feed(BUTTON_A)).to.equal(false)
      })
    })

    context('when any=true', function () {
      before(function () {
        this.subject.clear()
        this.subject.any = true
        this.subject.watch(DIRECTION_DOWN_LEFT)
        this.subject.watch(DIRECTION_LEFT)
        this.subject.watch(DIRECTION_UP_LEFT)
      })

      it('returns true for watched events', function () {
        expect(this.subject.feed(DIRECTION_DOWN_LEFT)).to.equal(true)
        expect(this.subject.feed(DIRECTION_LEFT)).to.equal(true)
        expect(this.subject.feed(DIRECTION_UP_LEFT)).to.equal(true)
      })

      it('returns false for unwatched events', function () {
        expect(this.subject.feed(DIRECTION_DOWN)).to.equal(false)
        expect(this.subject.feed(DIRECTION_DOWN_RIGHT)).to.equal(false)
        expect(this.subject.feed(DIRECTION_RIGHT)).to.equal(false)
        expect(this.subject.feed(DIRECTION_UP_RIGHT)).to.equal(false)
        expect(this.subject.feed(DIRECTION_UP)).to.equal(false)
        expect(this.subject.feed(DIRECTION_NEUTRAL)).to.equal(false)
      })

      it('sets the current frame number', function () {
        this.timer.counter = 1
        this.subject.feed(DIRECTION_DOWN_LEFT)
        expect(this.subject.frame).to.equal(1)
        this.timer.counter = 2
        this.subject.feed(DIRECTION_LEFT)
        expect(this.subject.frame).to.equal(2)
        this.timer.counter = 3
        this.subject.feed(DIRECTION_RIGHT) // not watched
        expect(this.subject.frame).to.equal(2)
      })
    })
  })

  describe('#valid', function () {
    context('when no timer is set', function () {
      before(function () {
        this.subject.clear()
        this.subject.frame = this.timer.counter
        this.subject.timer = null
      })

      it('returns false', function () {
        expect(this.subject.valid()).to.equal(false)
      })
    })

    context('when no frame is set', function () {
      before(function () {
        this.subject.clear()
        this.subject.timer = this.timer
        this.subject.frame = null
      })

      it('returns false', function () {
        expect(this.subject.valid()).to.equal(false)
      })
    })

    context('when timer and frame are set', function () {
      before(function () {
        this.subject.expiration = 30
        this.subject.clear()
        this.subject.timer = this.timer
        this.subject.watch(BUTTON_A)
      })

      context('and input did not expire', function () {
        before(function () {
          this.timer.counter = 1
          this.subject.feed(BUTTON_A)
          this.timer.counter = 25
        })

        it('returns true', function () {
          expect(this.subject.valid()).to.equal(true)
        })
      })

      context('and input expired', function () {
        before(function () {
          this.timer.counter = 1
          this.subject.feed(BUTTON_A)
          this.timer.counter = 35
        })

        it('returns false', function () {
          expect(this.subject.valid()).to.equal(false)
        })
      })
    })

    context('when charge is required', function () {
      before(function () {
        this.subject.clear()
        this.subject.expiration = 30
        this.subject.watch(DIRECTION_LEFT)
        this.subject.charge = 60
      })

      it('returns true if input is charged long enough', function () {
        this.timer.counter = 1
        this.subject.feed(DIRECTION_LEFT)
        expect(this.subject.valid()).to.equal(false)
        this.timer.counter = 61
        expect(this.subject.valid()).to.equal(true)
      })
    })
  })
})
