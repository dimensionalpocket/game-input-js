// @ts-check

'use strict'

import { expect } from '@dimensionalpocket/development'
import { JSDOM } from 'jsdom'
import { NumpadInput } from '../src/NumpadInput.js'

import {
  DIRECTION_DOWN,
  DIRECTION_DOWN_LEFT,
  DIRECTION_DOWN_RIGHT,
  DIRECTION_LEFT,
  DIRECTION_NEUTRAL,
  DIRECTION_RIGHT,
  DIRECTION_UP,
  DIRECTION_UP_LEFT,
  DIRECTION_UP_RIGHT
} from '../src/constants.js'

var events = []
function dispatcher (event, handler) { events.unshift([handler.id, event]) }

var dom = new JSDOM('', {})
var windowInstance = dom.window

function event (eventName, code, options) {
  options = options || {}
  Object.assign(options, { code })
  // @ts-ignore
  var evt = new windowInstance.KeyboardEvent(eventName, options)
  // @ts-ignore
  return windowInstance.dispatchEvent(evt)
}

describe('NumpadInput', function () {
  before(function () {
    this.input = new NumpadInput(windowInstance)
    this.input.on('input', dispatcher)
  })

  after(function () {
    windowInstance.close()
  })

  describe('#defaults', function () {
    it('assigns correct directions', function () {
      event('keydown', 'ArrowRight')
      expect(events[0][1]).to.equal(DIRECTION_RIGHT)
      event('keydown', 'ArrowUp')
      expect(events[0][1]).to.equal(DIRECTION_UP_RIGHT)
      event('keyup', 'ArrowRight')
      expect(events[0][1]).to.equal(DIRECTION_UP)
      event('keydown', 'ArrowLeft')
      expect(events[0][1]).to.equal(DIRECTION_UP_LEFT)
      event('keyup', 'ArrowUp')
      expect(events[0][1]).to.equal(DIRECTION_LEFT)
      event('keydown', 'ArrowDown')
      expect(events[0][1]).to.equal(DIRECTION_DOWN_LEFT)
      event('keyup', 'ArrowLeft')
      expect(events[0][1]).to.equal(DIRECTION_DOWN)
      event('keydown', 'ArrowRight')
      expect(events[0][1]).to.equal(DIRECTION_DOWN_RIGHT)
      event('keyup', 'ArrowDown')
      expect(events[0][1]).to.equal(DIRECTION_RIGHT)
      event('keyup', 'ArrowLeft')
      expect(events[0][1]).to.equal(DIRECTION_NEUTRAL)
    })

    it('assigns correct buttons', function () {
      event('keydown', 'Numpad7')
      expect(events[0][1]).to.equal('X')
      event('keyup', 'Numpad7')
      expect(events[0][1]).to.equal('x')
      event('keydown', 'Numpad8')
      expect(events[0][1]).to.equal('Y')
      event('keyup', 'Numpad8')
      expect(events[0][1]).to.equal('y')
      event('keydown', 'Numpad9')
      expect(events[0][1]).to.equal('Z')
      event('keyup', 'Numpad9')
      expect(events[0][1]).to.equal('z')
      event('keydown', 'Numpad4')
      expect(events[0][1]).to.equal('A')
      event('keyup', 'Numpad4')
      expect(events[0][1]).to.equal('a')
      event('keydown', 'Numpad5')
      expect(events[0][1]).to.equal('B')
      event('keyup', 'Numpad5')
      expect(events[0][1]).to.equal('b')
      event('keydown', 'Numpad6')
      expect(events[0][1]).to.equal('C')
      event('keyup', 'Numpad6')
      expect(events[0][1]).to.equal('c')
      event('keydown', 'NumpadEnter')
      expect(events[0][1]).to.equal('S')
      event('keyup', 'NumpadEnter')
      expect(events[0][1]).to.equal('s')
      event('keydown', 'NumpadSubtract')
      expect(events[0][1]).to.equal('T')
      event('keyup', 'NumpadSubtract')
      expect(events[0][1]).to.equal('t')
    })
  })
})
