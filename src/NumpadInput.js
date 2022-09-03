// @ts-check

'use strict'

import { KeyboardInput } from './KeyboardInput.js'

import {
  DIRECTION_DOWN,
  DIRECTION_LEFT,
  DIRECTION_RIGHT,
  DIRECTION_UP
} from './constants.js'

export class NumpadInput extends KeyboardInput {
  constructor (windowInstance) {
    super(windowInstance)
    this.id = 'Np'
  }

  defaults () {
    this.assignmentsUp.clear()
    this.assignmentsDown.clear()
    this.assign('ArrowUp', DIRECTION_UP)
    this.assign('ArrowLeft', DIRECTION_LEFT)
    this.assign('ArrowDown', DIRECTION_DOWN)
    this.assign('ArrowRight', DIRECTION_RIGHT)
    this.assign('Numpad7', 'X')
    this.assign('Numpad8', 'Y')
    this.assign('Numpad9', 'Z')
    // this.assign('...', 'L')
    this.assign('Numpad4', 'A')
    this.assign('Numpad5', 'B')
    this.assign('Numpad6', 'C')
    // this.assign('...', 'R')
    this.assign('NumpadEnter', 'S')
    this.assign('NumpadSubtract', 'T')
  }
}
