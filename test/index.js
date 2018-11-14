import { expect } from 'chai'
import { KeyboardInput, NumpadInput } from '../'

describe('index', function () {
  it('exports proper classes', function () {
    expect(KeyboardInput).to.exist()
    expect(NumpadInput).to.exist()
  })
})
