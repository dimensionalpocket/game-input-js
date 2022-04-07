// @ts-check

'use strict'

import { KeyCodes } from './KeyCodes.js'
import { BaseInput } from './BaseInput.js'

export class KeyboardInput extends BaseInput {
  constructor (windowInstance) {
    if (!windowInstance) {
      throw new Error('F-KI-WDW')
    }
    super()
    this.id = 'Kb'
    this.window = windowInstance
    this.assignmentsUp = new Map()
    this.assignmentsDown = new Map()
    this.actionsDown = new Map() // blocks keydown auto-repeat
    this.onKeyDown = this.onKeyDown.bind(this)
    this.onKeyUp = this.onKeyUp.bind(this)
    this.onWindowBlur = this.onWindowBlur.bind(this)
    this.defaults()
    this.install()
  }

  assign (key, action) {
    this.assignmentsUp.set(key, action.toLowerCase())
    this.assignmentsDown.set(key, action.toUpperCase())
  }

  onKeyDown (event) {
    if (event.repeat === true) { // Supported by some browsers
      return
    }
    var action = this.capture(event, true)
    if (!action) {
      return
    }
    if (this.actionsDown.get(action)) {
      return
    }
    this.actionsDown.set(action, true)
    this.process(action, true)
  }

  onKeyUp (event) {
    var action = this.capture(event, false)
    if (!action) {
      return
    }
    this.actionsDown.set(action.toUpperCase(), false)
    this.process(action, false)
  }

  onWindowBlur (_event) {
    this.process('5') // resets directional state
    this.actionsDown.clear()
  }

  /**
   * Captures a keyboard event.
   *
   * @param {any} event
   * @param {boolean} down - `true` if key is being held down.
   */
  capture (event, down) {
    // console.log('Capture Start', Date.now())
    var code = event.code
    if (code) {
      return this.captureCode(code, down, event)
    }
    var keyNumber = event.keyCode || event.which
    code = KeyCodes.get(keyNumber)
    return code ? this.captureCode(code, down, event) : null
  }

  captureCode (code, down, event) {
    var assignments = down ? this.assignmentsDown : this.assignmentsUp
    var action = assignments.get(code)
    if (!action) {
      return false
    }
    event.preventDefault() // Always prevent default if captured key is assigned.
    // console.log('Capture Action', Date.now())
    return action
  }

  install () {
    this.window.addEventListener('keydown', this.onKeyDown, false)
    this.window.addEventListener('keyup', this.onKeyUp, false)
    this.window.addEventListener('blur', this.onWindowBlur, false)
  }

  uninstall () {
    this.window.removeEventListener('keydown', this.onKeyDown, false)
    this.window.removeEventListener('keyup', this.onKeyUp, false)
    this.window.removeEventListener('blur', this.onWindowBlur, false)
  }

  defaults () {
    this.assignmentsDown.clear()
    this.assignmentsUp.clear()
    this.assign('KeyW', '8')
    this.assign('KeyA', '4')
    this.assign('KeyS', '2')
    this.assign('KeyD', '6')
    this.assign('KeyY', 'X')
    this.assign('KeyU', 'Y')
    this.assign('KeyI', 'Z')
    this.assign('KeyO', 'L')
    this.assign('KeyH', 'A')
    this.assign('KeyJ', 'B')
    this.assign('KeyK', 'C')
    this.assign('KeyL', 'R')
    this.assign('Enter', 'S')
    this.assign('Backspace', 'T')
  }
}
