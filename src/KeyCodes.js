'use strict'

// Maps each key number to its code string.
// Used mostly for performance.
var KeyCodes = new Map()

KeyCodes.set(48, 'Digit0')
KeyCodes.set(49, 'Digit1')
KeyCodes.set(50, 'Digit2')
KeyCodes.set(51, 'Digit3')
KeyCodes.set(52, 'Digit4')
KeyCodes.set(53, 'Digit5')
KeyCodes.set(54, 'Digit6')
KeyCodes.set(55, 'Digit7')
KeyCodes.set(56, 'Digit8')
KeyCodes.set(57, 'Digit9')

KeyCodes.set(65, 'KeyA')
KeyCodes.set(66, 'KeyB')
KeyCodes.set(67, 'KeyC')
KeyCodes.set(68, 'KeyD')
KeyCodes.set(69, 'KeyE')
KeyCodes.set(70, 'KeyF')
KeyCodes.set(71, 'KeyG')
KeyCodes.set(72, 'KeyH')
KeyCodes.set(73, 'KeyI')
KeyCodes.set(74, 'KeyJ')
KeyCodes.set(75, 'KeyK')
KeyCodes.set(76, 'KeyL')
KeyCodes.set(77, 'KeyM')
KeyCodes.set(78, 'KeyN')
KeyCodes.set(79, 'KeyO')
KeyCodes.set(80, 'KeyP')
KeyCodes.set(81, 'KeyQ')
KeyCodes.set(82, 'KeyR')
KeyCodes.set(83, 'KeyS')
KeyCodes.set(84, 'KeyT')
KeyCodes.set(85, 'KeyU')
KeyCodes.set(86, 'KeyV')
KeyCodes.set(87, 'KeyW')
KeyCodes.set(88, 'KeyX')
KeyCodes.set(89, 'KeyY')
KeyCodes.set(90, 'KeyZ')

KeyCodes.set(8, 'Backspace')
KeyCodes.set(9, 'Tab')
KeyCodes.set(16, 'ShiftLeft')
KeyCodes.set(17, 'ControlLeft')
KeyCodes.set(18, 'AltLeft')
KeyCodes.set(20, 'CapsLock')
KeyCodes.set(27, 'Escape')
KeyCodes.set(91, 'MetaLeft')
KeyCodes.set(32, 'Space')

KeyCodes.set(38, 'ArrowUp')
KeyCodes.set(40, 'ArrowDown')
KeyCodes.set(37, 'ArrowLeft')
KeyCodes.set(39, 'ArrowRight')

KeyCodes.set(45, 'Insert')
KeyCodes.set(46, 'Delete')
KeyCodes.set(36, 'Home')
KeyCodes.set(35, 'End')
KeyCodes.set(33, 'PageUp')
KeyCodes.set(34, 'PageDown')

KeyCodes.set(144, 'NumLock')
KeyCodes.set(96, 'Numpad0')
KeyCodes.set(97, 'Numpad1')
KeyCodes.set(98, 'Numpad2')
KeyCodes.set(99, 'Numpad3')
KeyCodes.set(100, 'Numpad4')
KeyCodes.set(101, 'Numpad5')
KeyCodes.set(102, 'Numpad6')
KeyCodes.set(103, 'Numpad7')
KeyCodes.set(104, 'Numpad8')
KeyCodes.set(105, 'Numpad9')
KeyCodes.set(106, 'NumpadMultiply')
KeyCodes.set(107, 'NumpadAdd')
KeyCodes.set(109, 'NumpadSubtract')
KeyCodes.set(110, 'NumpadDecimal')
KeyCodes.set(111, 'NumpadDivide')

KeyCodes.set(219, 'BracketLeft')
KeyCodes.set(221, 'BracketRight')
KeyCodes.set(220, 'Backslash')
KeyCodes.set(186, 'Semicolon')
KeyCodes.set(222, 'Quote')
KeyCodes.set(188, 'Comma')
KeyCodes.set(190, 'Period')
KeyCodes.set(191, 'Slash')
KeyCodes.set(192, 'Backquote')

export { KeyCodes }