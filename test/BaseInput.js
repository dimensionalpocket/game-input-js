// @ts-check

'use strict'

import { expect } from '@dimensionalpocket/development'
import { BaseInput } from '../src/BaseInput.js'
import { DIRECTIONS, BUTTONS } from '../src/constants.js'

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
      expect(DIRECTIONS).to.include('4')
      expect(DIRECTIONS).to.include('2')
      expect(DIRECTIONS).to.include('6')
      expect(DIRECTIONS).to.include('8')
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
        this.input.process('4', true)
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
        this.input.process('4', true)
        expect(events[0][0]).to.equal('T')
        this.input.process('4', false)
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
        this.input.process('4', true)
        expect(this.input.dds).to.have.length(1)
        expect(this.input.dds[0]).to.equal('4')
        this.input.process('4', true)
        expect(this.input.dds).to.have.length(1)
        this.input.process('4', false)
        expect(this.input.dds).to.have.length(0)
      })

      it('is added in correct order', function () {
        this.input.process('4', true)
        expect(this.input.dds).to.have.length(1)
        expect(this.input.dds[0]).to.equal('4')
        this.input.process('2', true)
        expect(this.input.dds).to.have.length(2)
        expect(this.input.dds[0]).to.equal('4')
        expect(this.input.dds[1]).to.equal('2')
        this.input.process('6', true)
        expect(this.input.dds).to.have.length(3)
        expect(this.input.dds[0]).to.equal('4')
        expect(this.input.dds[1]).to.equal('2')
        expect(this.input.dds[2]).to.equal('6')
        this.input.process('8', true)
        expect(this.input.dds).to.have.length(4)
        expect(this.input.dds[0]).to.equal('4')
        expect(this.input.dds[1]).to.equal('2')
        expect(this.input.dds[2]).to.equal('6')
        expect(this.input.dds[3]).to.equal('8')
        this.input.process('8', false)
        this.input.process('6', false)
        this.input.process('4', false)
        this.input.process('2', false)
        expect(this.input.dds).to.have.length(0)
      })

      it('emits single directions', function () {
        for (var direction of DIRECTIONS) {
          this.input.process(direction, true)
          expect(events[0][1]).to.equal(direction)
          this.input.process(direction, false)
          expect(events[0][1]).to.equal('5') // neutral
        }
      })

      it('emits diagonals', function () {
        // Left
        this.input.process('4', true)
        this.input.process('2', true)
        expect(events[0][1]).to.equal('1')
        this.input.process('2', false)
        expect(events[0][1]).to.equal('4')
        this.input.process('8', true)
        expect(events[0][1]).to.equal('7')
        this.input.process('8', false)
        this.input.process('4', false)
        expect(events[0][1]).to.equal('5')
        // Right
        this.input.process('6', true)
        this.input.process('2', true)
        expect(events[0][1]).to.equal('3')
        this.input.process('2', false)
        expect(events[0][1]).to.equal('6')
        this.input.process('8', true)
        expect(events[0][1]).to.equal('9')
        this.input.process('8', false)
        this.input.process('4', false)
        expect(events[0][1]).to.equal('5')
        // Down
        this.input.process('2', true)
        this.input.process('4', true)
        expect(events[0][1]).to.equal('1')
        this.input.process('4', false)
        expect(events[0][1]).to.equal('2')
        this.input.process('6', true)
        expect(events[0][1]).to.equal('3')
        this.input.process('6', false)
        this.input.process('2', false)
        expect(events[0][1]).to.equal('5')
        // Up
        this.input.process('8', true)
        this.input.process('4', true)
        expect(events[0][1]).to.equal('7')
        this.input.process('4', false)
        expect(events[0][1]).to.equal('8')
        this.input.process('6', true)
        expect(events[0][1]).to.equal('9')
        this.input.process('8', false)
        this.input.process('6', false)
        expect(events[0][1]).to.equal('5')
      })

      it('handles simultaneons opposite directions correctly', function () {
        // Left
        this.input.process('4', true)
        this.input.process('6', true)
        expect(events[0][1]).to.equal('6')
        this.input.process('6', false)
        expect(events[0][1]).to.equal('4')
        this.input.process('4', false)
        expect(events[0][1]).to.equal('5')
        // Right
        this.input.process('6', true)
        this.input.process('4', true)
        expect(events[0][1]).to.equal('4')
        this.input.process('4', false)
        expect(events[0][1]).to.equal('6')
        this.input.process('6', false)
        expect(events[0][1]).to.equal('5')
        // Down
        this.input.process('2', true)
        this.input.process('8', true)
        expect(events[0][1]).to.equal('8')
        this.input.process('8', false)
        expect(events[0][1]).to.equal('2')
        this.input.process('2', false)
        expect(events[0][1]).to.equal('5')
        // Up
        this.input.process('8', true)
        this.input.process('2', true)
        expect(events[0][1]).to.equal('2')
        this.input.process('2', false)
        expect(events[0][1]).to.equal('8')
        this.input.process('8', false)
        expect(events[0][1]).to.equal('5')
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
      this.input.process('4', true)
      var result = this.input.diagonalize('0', true)
      expect(result).to.equal('5')
      this.input.process('4', false)
      this.input.diagonalize('0', false)
      expect(this.input.dds).to.have.length(0)
    })
  })
})
