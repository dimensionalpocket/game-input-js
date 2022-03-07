// @ts-check

'use strict'

import { expect } from '@dimensionalpocket/development'
import { KeyboardInput, NumpadInput } from '../index.js'

describe('index', function () {
  it('exports proper classes', function () {
    expect(KeyboardInput).to.exist
    expect(NumpadInput).to.exist
  })
})
