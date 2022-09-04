// @ts-check

'use strict'

import { expect } from '@dimensionalpocket/development'
import { BaseInput } from '../src/BaseInput.js'

import {
  DIRECTIONS,
  BUTTONS,
  DIRECTION_NEUTRAL,
  DIRECTION_LEFT,
  DIRECTION_DOWN,
  DIRECTION_RIGHT,
  DIRECTION_UP,
  DIRECTION_DOWN_LEFT,
  DIRECTION_UP_LEFT,
  DIRECTION_DOWN_RIGHT,
  DIRECTION_UP_RIGHT
} from '../src/constants.js'

var events = []
function dispatcher (event, handler) { events.unshift([handler.id, event]) }

describe('BaseInput', function () {
  before(function () {
    this.input = new BaseInput()
    this.input.id = 'T' // Test
    this.input.on('input', dispatcher)
  })

  describe('constants', function () {
    it('has four values in DIRECTIONS', function () {
      expect(DIRECTIONS).to.include(DIRECTION_LEFT)
      expect(DIRECTIONS).to.include(DIRECTION_DOWN)
      expect(DIRECTIONS).to.include(DIRECTION_RIGHT)
      expect(DIRECTIONS).to.include(DIRECTION_UP)
    })

    it('has ten values in BUTTONS', function () {
      expect(BUTTONS).to.include('A')
      expect(BUTTONS).to.include('B')
      expect(BUTTONS).to.include('C')
      expect(BUTTONS).to.include('X')
      expect(BUTTONS).to.include('Y')
      expect(BUTTONS).to.include('Z')
      expect(BUTTONS).to.include('L')
      expect(BUTTONS).to.include('R')
      expect(BUTTONS).to.include('S')
      expect(BUTTONS).to.include('T')
    })
  })

  describe('constructor', function () {
    before(function () {
      this.newInput = new BaseInput()
    })

    it('sets enabled to true', function () {
      expect(this.newInput.enabled).to.equal(true)
    })
  })

  describe('#process', function () {
    context('when enabled is false', function () {
      before(function () {
        this.input.enabled = false
        this.input.process(DIRECTION_LEFT, true)
      })

      after(function () {
        this.input.enabled = true
      })

      it('does not emit event', function () {
        expect(events).to.have.length(0)
      })

      it('does not change direction state', function () {
        expect(this.input.dds).to.have.length(0)
      })
    })

    context('when enabled is true', function () {
      it('emits with correct handler', function () {
        this.input.process(DIRECTION_LEFT, true)
        expect(events[0][0]).to.equal('T')
        this.input.process(DIRECTION_LEFT, false)
      })
    })

    describe('direction', function () {
      it('is added to state array', function () {
        for (var direction of DIRECTIONS) {
          this.input.process(direction, true)
          expect(this.input.dds).to.have.length(1)
          expect(this.input.dds).to.include(direction)
          this.input.process(direction, false)
          expect(this.input.dds).to.have.length(0)
        }
      })

      it('does not add the same direction twice', function () {
        this.input.process(DIRECTION_LEFT, true)
        expect(this.input.dds).to.have.length(1)
        expect(this.input.dds[0]).to.equal(DIRECTION_LEFT)
        this.input.process(DIRECTION_LEFT, true)
        expect(this.input.dds).to.have.length(1)
        this.input.process(DIRECTION_LEFT, false)
        expect(this.input.dds).to.have.length(0)
      })

      it('is added in correct order', function () {
        this.input.process(DIRECTION_LEFT, true)
        expect(this.input.dds).to.have.length(1)
        expect(this.input.dds[0]).to.equal(DIRECTION_LEFT)
        this.input.process(DIRECTION_DOWN, true)
        expect(this.input.dds).to.have.length(2)
        expect(this.input.dds[0]).to.equal(DIRECTION_LEFT)
        expect(this.input.dds[1]).to.equal(DIRECTION_DOWN)
        this.input.process(DIRECTION_RIGHT, true)
        expect(this.input.dds).to.have.length(3)
        expect(this.input.dds[0]).to.equal(DIRECTION_LEFT)
        expect(this.input.dds[1]).to.equal(DIRECTION_DOWN)
        expect(this.input.dds[2]).to.equal(DIRECTION_RIGHT)
        this.input.process(DIRECTION_UP, true)
        expect(this.input.dds).to.have.length(4)
        expect(this.input.dds[0]).to.equal(DIRECTION_LEFT)
        expect(this.input.dds[1]).to.equal(DIRECTION_DOWN)
        expect(this.input.dds[2]).to.equal(DIRECTION_RIGHT)
        expect(this.input.dds[3]).to.equal(DIRECTION_UP)
        this.input.process(DIRECTION_UP, false)
        this.input.process(DIRECTION_RIGHT, false)
        this.input.process(DIRECTION_LEFT, false)
        this.input.process(DIRECTION_DOWN, false)
        expect(this.input.dds).to.have.length(0)
      })

      it('emits single directions', function () {
        for (var direction of DIRECTIONS) {
          this.input.process(direction, true)
          expect(events[0][1]).to.equal(direction)
          this.input.process(direction, false)
          expect(events[0][1]).to.equal(DIRECTION_NEUTRAL) // neutral
        }
      })

      it('emits diagonals', function () {
        // Left
        this.input.process(DIRECTION_LEFT, true)
        this.input.process(DIRECTION_DOWN, true)
        expect(events[0][1]).to.equal(DIRECTION_DOWN_LEFT)
        this.input.process(DIRECTION_DOWN, false)
        expect(events[0][1]).to.equal(DIRECTION_LEFT)
        this.input.process(DIRECTION_UP, true)
        expect(events[0][1]).to.equal(DIRECTION_UP_LEFT)
        this.input.process(DIRECTION_UP, false)
        this.input.process(DIRECTION_LEFT, false)
        expect(events[0][1]).to.equal(DIRECTION_NEUTRAL)
        // Right
        this.input.process(DIRECTION_RIGHT, true)
        this.input.process(DIRECTION_DOWN, true)
        expect(events[0][1]).to.equal(DIRECTION_DOWN_RIGHT)
        this.input.process(DIRECTION_DOWN, false)
        expect(events[0][1]).to.equal(DIRECTION_RIGHT)
        this.input.process(DIRECTION_UP, true)
        expect(events[0][1]).to.equal(DIRECTION_UP_RIGHT)
        this.input.process(DIRECTION_UP, false)
        this.input.process(DIRECTION_LEFT, false)
        expect(events[0][1]).to.equal(DIRECTION_NEUTRAL)
        // Down
        this.input.process(DIRECTION_DOWN, true)
        this.input.process(DIRECTION_LEFT, true)
        expect(events[0][1]).to.equal(DIRECTION_DOWN_LEFT)
        this.input.process(DIRECTION_LEFT, false)
        expect(events[0][1]).to.equal(DIRECTION_DOWN)
        this.input.process(DIRECTION_RIGHT, true)
        expect(events[0][1]).to.equal(DIRECTION_DOWN_RIGHT)
        this.input.process(DIRECTION_RIGHT, false)
        this.input.process(DIRECTION_DOWN, false)
        expect(events[0][1]).to.equal(DIRECTION_NEUTRAL)
        // Up
        this.input.process(DIRECTION_UP, true)
        this.input.process(DIRECTION_LEFT, true)
        expect(events[0][1]).to.equal(DIRECTION_UP_LEFT)
        this.input.process(DIRECTION_LEFT, false)
        expect(events[0][1]).to.equal(DIRECTION_UP)
        this.input.process(DIRECTION_RIGHT, true)
        expect(events[0][1]).to.equal(DIRECTION_UP_RIGHT)
        this.input.process(DIRECTION_UP, false)
        this.input.process(DIRECTION_RIGHT, false)
        expect(events[0][1]).to.equal(DIRECTION_NEUTRAL)
      })

      it('handles simultaneons opposite directions correctly', function () {
        // Left
        this.input.process(DIRECTION_LEFT, true)
        this.input.process(DIRECTION_RIGHT, true)
        expect(events[0][1]).to.equal(DIRECTION_RIGHT)
        this.input.process(DIRECTION_RIGHT, false)
        expect(events[0][1]).to.equal(DIRECTION_LEFT)
        this.input.process(DIRECTION_LEFT, false)
        expect(events[0][1]).to.equal(DIRECTION_NEUTRAL)
        // Right
        this.input.process(DIRECTION_RIGHT, true)
        this.input.process(DIRECTION_LEFT, true)
        expect(events[0][1]).to.equal(DIRECTION_LEFT)
        this.input.process(DIRECTION_LEFT, false)
        expect(events[0][1]).to.equal(DIRECTION_RIGHT)
        this.input.process(DIRECTION_RIGHT, false)
        expect(events[0][1]).to.equal(DIRECTION_NEUTRAL)
        // Down
        this.input.process(DIRECTION_DOWN, true)
        this.input.process(DIRECTION_UP, true)
        expect(events[0][1]).to.equal(DIRECTION_UP)
        this.input.process(DIRECTION_UP, false)
        expect(events[0][1]).to.equal(DIRECTION_DOWN)
        this.input.process(DIRECTION_DOWN, false)
        expect(events[0][1]).to.equal(DIRECTION_NEUTRAL)
        // Up
        this.input.process(DIRECTION_UP, true)
        this.input.process(DIRECTION_DOWN, true)
        expect(events[0][1]).to.equal(DIRECTION_DOWN)
        this.input.process(DIRECTION_DOWN, false)
        expect(events[0][1]).to.equal(DIRECTION_UP)
        this.input.process(DIRECTION_UP, false)
        expect(events[0][1]).to.equal(DIRECTION_NEUTRAL)
      })
    })

    describe('button', function () {
      it('emits buttons correctly', function () {
        for (var button of BUTTONS) {
          this.input.process(button, true)
          expect(events[0][1]).to.equal(button)
          this.input.process(button.toLowerCase(), false)
          expect(events[0][1]).to.equal(button.toLowerCase())
        }
      })
    })
  })

  describe('diagonalize', function () {
    it('returns neutral when input is not recognized', function () {
      this.input.process(DIRECTION_LEFT, true)
      var result = this.input.diagonalize('0', true)
      expect(result).to.equal(DIRECTION_NEUTRAL)
      this.input.process(DIRECTION_LEFT, false)
      this.input.diagonalize('0', false)
      expect(this.input.dds).to.have.length(0)
    })
  })
})
