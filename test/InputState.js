import { expect } from '@dimensionalpocket/development'
import { InputState } from '../src/InputState.js'
import { ALL_INPUTS } from '../src/constants.js'

describe('InputState', function () {
  describe('constructor', function () {
    it('initializes with null as default', function () {
      var state = new InputState()
      for (var i of ALL_INPUTS) {
        expect(state[i]).to.equal(null)
      }
    })

    it('initializes with given value', function () {
      var state = new InputState('sbrubbles')
      for (var i of ALL_INPUTS) {
        expect(state[i]).to.equal('sbrubbles')
      }
    })
  })

  describe('#clear', function () {
    it('sets all states to given value', function () {
      var state = new InputState()
      state.clear('cleaerd!')
      for (var i of ALL_INPUTS) {
        expect(state[i]).to.equal('cleaerd!')
      }
    })

    it('sets all states to initial value if no parameter is given', function () {
      var state = new InputState('initialD')
      state.clear()
      for (var i of ALL_INPUTS) {
        expect(state[i]).to.equal('initialD')
      }
    })
  })
})
