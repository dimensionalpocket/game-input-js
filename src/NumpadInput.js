// @ts-check

'use strict'

import { KeyboardInput } from './KeyboardInput.js'

export class NumpadInput extends KeyboardInput {
  constructor (windowInstance) {
    super(windowInstance)
    this.id = 'N'
  }

  defaults () {
    this.assignmentsUp.clear()
    this.assignmentsDown.clear()
    this.assign('ArrowUp', '8')
    this.assign('ArrowLeft', '4')
    this.assign('ArrowDown', '2')
    this.assign('ArrowRight', '6')
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
