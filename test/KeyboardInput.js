import { expect } from 'chai'
import { JSDOM } from 'jsdom'
import { KeyboardInput } from '../lib/KeyboardInput'

var events = []
function dispatcher (handler, event) { events.unshift([handler.id, event]) }

var dom = new JSDOM(``, {})
var windowInstance = dom.window

function event (eventName, code, options) {
  options = options || {}
  Object.assign(options, { code })
  var evt = new windowInstance.KeyboardEvent(eventName, options)
  return windowInstance.dispatchEvent(evt)
}

describe('KeyboardInput', function () {
  before(function () {
    this.input = new KeyboardInput(windowInstance)
    this.input.dispatch = dispatcher
  })

  after(function () {
    windowInstance.close()
  })

  describe('constructor', function () {
    it('throws without providing window instance', function () {
      var fn = () => { return new KeyboardInput() }
      expect(fn).to.throw('F-KI-WDW')
    })
  })

  describe('#capture', function () {
    it('does not dispatch event for invalid codes', function () {
      event('keydown', 'DONOTEXIST')
      expect(events).to.have.length(0)
      event('keyup', 'DONOTEXIST')
      expect(events).to.have.length(0)
      event('keydown', undefined, 0)
      expect(events).to.have.length(0)
      event('keyup', undefined, 0)
      expect(events).to.have.length(0)
      event('keydown', undefined, undefined, 0)
      expect(events).to.have.length(0)
      event('keyup', undefined, undefined, 0)
      expect(events).to.have.length(0)
    })

    it('does not emit twice when KeyDown event is spammed', function () {
      event('keydown', 'KeyW')
      expect(events).to.have.length(1)
      event('keydown', 'KeyW')
      expect(events).to.have.length(1)
      event('keyup', 'KeyW')
      expect(events).to.have.length(2)
      event('keydown', 'KeyW', { repeat: true })
      expect(events).to.have.length(2)
    })

    it('captures event.code', function () {
      event('keydown', 'KeyW')
      expect(events[0][1]).to.equal('8')
      event('keyup', 'KeyW')
      expect(events[0][1]).to.equal('5')
    })

    it('captures event.which', function () {
      event('keydown', undefined, { which: 87 })
      expect(events[0][1]).to.equal('8')
      event('keyup', undefined, { which: 87 })
      expect(events[0][1]).to.equal('5')
    })

    it('captures event.keyCode', function () {
      event('keydown', undefined, { keyCode: 87 })
      expect(events[0][1]).to.equal('8')
      event('keyup', undefined, { keyCode: 87 })
      expect(events[0][1]).to.equal('5')
    })

    it('calls preventDefault() on event', function () {
      var prevented = false
      var evt = new windowInstance.KeyboardEvent('keydown', { code: 'KeyW' })
      evt.preventDefault = () => { prevented = true }
      windowInstance.dispatchEvent(evt)
      expect(prevented).to.equal(true)
      event('keyup', 'KeyW') // reset state
    })
  })

  describe('#defaults', function () {
    it('assigns correct directions', function () {
      event('keydown', 'KeyD')
      expect(events[0][1]).to.equal('6')
      event('keydown', 'KeyW')
      expect(events[0][1]).to.equal('9')
      event('keyup', 'KeyD')
      expect(events[0][1]).to.equal('8')
      event('keydown', 'KeyA')
      expect(events[0][1]).to.equal('7')
      event('keyup', 'KeyW')
      expect(events[0][1]).to.equal('4')
      event('keydown', 'KeyS')
      expect(events[0][1]).to.equal('1')
      event('keyup', 'KeyA')
      expect(events[0][1]).to.equal('2')
      event('keydown', 'KeyD')
      expect(events[0][1]).to.equal('3')
      event('keyup', 'KeyS')
      expect(events[0][1]).to.equal('6')
      event('keyup', 'KeyD')
      expect(events[0][1]).to.equal('5')
    })

    it('assigns correct buttons', function () {
      event('keydown', 'KeyY')
      expect(events[0][1]).to.equal('X')
      event('keyup', 'KeyY')
      expect(events[0][1]).to.equal('x')
      event('keydown', 'KeyU')
      expect(events[0][1]).to.equal('Y')
      event('keyup', 'KeyU')
      expect(events[0][1]).to.equal('y')
      event('keydown', 'KeyI')
      expect(events[0][1]).to.equal('Z')
      event('keyup', 'KeyI')
      expect(events[0][1]).to.equal('z')
      event('keydown', 'KeyO')
      expect(events[0][1]).to.equal('L')
      event('keyup', 'KeyO')
      expect(events[0][1]).to.equal('l')
      event('keydown', 'KeyH')
      expect(events[0][1]).to.equal('A')
      event('keyup', 'KeyH')
      expect(events[0][1]).to.equal('a')
      event('keydown', 'KeyJ')
      expect(events[0][1]).to.equal('B')
      event('keyup', 'KeyJ')
      expect(events[0][1]).to.equal('b')
      event('keydown', 'KeyK')
      expect(events[0][1]).to.equal('C')
      event('keyup', 'KeyK')
      expect(events[0][1]).to.equal('c')
      event('keydown', 'KeyL')
      expect(events[0][1]).to.equal('R')
      event('keyup', 'KeyL')
      expect(events[0][1]).to.equal('r')
      event('keydown', 'Enter')
      expect(events[0][1]).to.equal('S')
      event('keyup', 'Enter')
      expect(events[0][1]).to.equal('s')
      event('keydown', 'Backspace')
      expect(events[0][1]).to.equal('T')
      event('keyup', 'Backspace')
      expect(events[0][1]).to.equal('t')
    })
  })

  describe('#onWindowBlur', function () {
    before(function () {
      event('keydown', 'KeyW')
      windowInstance.dispatchEvent(new windowInstance.FocusEvent('blur'))
    })

    it('resets directional state', function () {
      expect(events[0][1]).to.equal('5')
    })
  })

  describe('#uninstall', function () {
    before(function () {
      events.length = 0
      this.input.uninstall()
    })

    it('removes listeners', function () {
      event('keydown', 'KeyW')
      expect(events).to.have.length(0)
    })
  })
})
