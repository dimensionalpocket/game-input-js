# @fightron/inputs

[![Build Status](https://travis-ci.com/pauloddr/fightron-inputs.svg?branch=master)](https://travis-ci.com/pauloddr/fightron-inputs)
[![Coverage Status](https://coveralls.io/repos/github/pauloddr/fightron-inputs/badge.svg?branch=master)](https://coveralls.io/github/pauloddr/fightron-inputs?branch=master)

Classes in this repository handle input manipulation from different controllers.

## Controller Layout

All classes assume the following controller layout:

* `1` to `9` - directional state following Numpad convention, where `5` is neutral.
* `A`, `B`, `C`, `X`, `Y`, `Z`, `L`, `R` - action buttons.
* `S` - Start.
* `T` - Select/Option/Back.

Subclasses are responsible to handle mapping of keys or gamepad buttons to the actions above.

## Class: `BaseInput`

This is the class inherited by all input handlers.

Properties:

* `id` - ID of the handler. Should be the shortest string possible, as this value is sent over messaging to workers and remote connections.
* `enabled` - when `true`, will call `dispatch()` on events. Set to `false` to temporarily halt input handling.

Methods:

* `process(event, state)` - parses input events.
* `dispatch(handler, event)` - called when an input event occurs. Should be overwritten by external code. Takes the following arguments:
  * `handler` - the handler instance. Listeners will likely want the `id` property to detect which handler fired the event.
  * `event` - a one-character string that represents the input event.

### Events

Event values are case-sensitive.

|Event Value|Description|
|---|---|
|`"A"`|A pressed|
|`"B"`|B pressed|
|`"C"`|C pressed|
|`"X"`|X pressed|
|`"Y"`|Y pressed|
|`"Z"`|Z pressed|
|`"L"`|L pressed|
|`"R"`|R pressed|
|`"S"`|S (Start) pressed|
|`"T"`|T (Select/Option/Back) pressed|
|`"a"`|A released|
|`"b"`|B released|
|`"c"`|C released|
|`"x"`|X released|
|`"y"`|Y released|
|`"z"`|Z released|
|`"l"`|L released|
|`"r"`|R released|
|`"s"`|S (Start) released|
|`"t"`|T (Select/Option/Back) released|
|`"5"`|Neutral directional position|
|`"4"`|Left directional position|
|`"6"`|Right directional position|
|`"2"`|Down directional position|
|`"8"`|Up directional position|
|`"1"`|Down-Left directional position|
|`"3"`|Down-Right directional position|
|`"7"`|Up-Left directional position|
|`"9"`|Up-Right directional position|

### Input Buffer

(TBD)

## Class: `KeyboardInput`

This handler maps keyboard keys to the proper actions.

It relies on the `event.code` property, falling back to `event.which` and `event.keyCode` otherwise.

It also handles `keydown` events internally to avoid "input spamming" when the key is held down.

It has a default ID of `"K"`.

Default mappings:

* `W` - Up
* `S` - Down
* `A` - Left
* `D` - Right
* `Y` - X
* `U` - Y
* `I` - Z
* `H` - A
* `J` - B
* `K` - C
* `O` - L
* `L` - R
* `Enter` - Start
* `Backspace` - Select/Option

## Class: `NumpadInput`

This handler is a subclass of `KeyboardInput` that maps its default keys to the right side of the keyboard, allowing two players to use the same keyboard locally.

It has a default ID of `"N"`.

Note: this handler is not supported by browsers that cannot read `event.code` events (such as Internet Explorer). That event is the only way to detect "NumpadEnter", otherwise it conflicts with the normal "Enter" key.

Default mappings:

* `ArrowUp` - Up
* `ArrowDown` - Down
* `ArrowLeft` - Left
* `ArrowRight` - Right
* `Numpad7` - X
* `Numpad8` - Y
* `Numpad9` - Z
* `Numpad4` - A
* `Numpad5` - B
* `Numpad6` - C
* `NumpadEnter` - Start
* `Numpad+` - Select/Option

## Gamepad Support and Contributions

This repository stores the default definitions of known gamepads. As an open-source repository, it allows contributions from other developers and players that would like to add support to different gaming controllers.

As of now, gamepad support is not available.

## Q&A

### Why not inherit from `EventEmitter` instead of overwriting the `dispatch` function?

Short answer: performance.

Long answer: inputs are speed-sensitive. There are a lot of things that interfere with input delay, and we don't want to add another layer of complexity on top of everything else.

## License

MIT
