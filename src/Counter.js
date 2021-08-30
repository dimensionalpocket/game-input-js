import { Base } from './Base.js'

const DEFAULT_INTERVAL = 1000 / 60 // 60 FPS

var _intervals = new WeakMap()
var unassignedFn = function () {}

// Used as a frame counter by both Client and Server.
export class Counter extends Base {
  constructor () {
    super()
    this.current = 0
    this.next = this.next.bind(this)
    this.onChange = unassignedFn // should be overwritten by external code
  }

  next () {
    ++this.current
    this.onChange(this)
  }

  add (frames) {
    for (var i = 1; i <= frames; ++i) {
      this.next()
    }
  }

  start (intervalMs) {
    var interval = setInterval(this.next, intervalMs || DEFAULT_INTERVAL) // 60FPS default
    _intervals.set(this, interval)
  }

  stop () {
    var interval = _intervals.get(this)
    clearInterval(interval)
    _intervals.delete(this)
  }

  zero () {
    this.set(0)
  }

  set (c) {
    this.current = c
  }

  free () {
    this.stop()
    this.next = null
    this.onChange = null
    super.free()
  }
}
