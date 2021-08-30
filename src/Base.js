// Base class used by mostly everything.
export class Base {
  constructor () {
    this._free = false
  }

  // Removes external references, reducing GC stress.
  // Implemented by subclasses.
  free () {
    this._free = true
  }
}
