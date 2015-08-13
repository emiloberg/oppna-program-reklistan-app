'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HTTPGENERIC = (function (_Error) {
	_inherits(HTTPGENERIC, _Error);

	function HTTPGENERIC() {
		var msg = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

		_classCallCheck(this, HTTPGENERIC);

		_get(Object.getPrototypeOf(HTTPGENERIC.prototype), 'constructor', this).call(this);
		this.message = msg;
		this.name = 'HTTPGENERIC';
	}

	return HTTPGENERIC;
})(Error);

var REKError = {
	HTTPGENERIC: HTTPGENERIC
};

exports['default'] = REKError;
module.exports = exports['default'];