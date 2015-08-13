'use strict';
Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _utilsImages = require('./../utils/images');

var _utilsImages2 = _interopRequireDefault(_utilsImages);

var _utilsLanguage = require('./../utils/language');

var _utilsLanguage2 = _interopRequireDefault(_utilsLanguage);

var _dataObservable = require('data/observable');

var ActionBar = (function (_Observable) {
	_inherits(ActionBar, _Observable);

	/**
  * @param {string} pageTitle Current page title.
  * @param {string} backTitle Title of back button.
  * @param {number} selectedIndex 0 for drugs and 1 for advice.
  * @param {string} enabledTabs One of: [both, drugs, advice, none].
  */

	function ActionBar(pageTitle, backTitle, selectedIndex) {
		var enabledTabs = arguments.length <= 3 || arguments[3] === undefined ? 'both' : arguments[3];
		var ActionBarType = arguments.length <= 4 || arguments[4] === undefined ? 'normal' : arguments[4];

		_classCallCheck(this, ActionBar);

		_get(Object.getPrototypeOf(ActionBar.prototype), 'constructor', this).call(this);
		this._iconBack = _utilsImages2['default'].left;
		this._iconSearch = _utilsImages2['default'].search;
		this._iconMenu = _utilsImages2['default'].menu;
		this._pageTitle = pageTitle;
		this._backTitle = backTitle;
		this._selectedIndex = selectedIndex;
		this._enabledTabs = enabledTabs;
		this._txtDrugs = _utilsLanguage2['default'].drugs;
		this._txtAdvice = _utilsLanguage2['default'].advice;

		if (ActionBarType) {
			this._iconClose = _utilsImages2['default'].close;
		}
	}

	_createClass(ActionBar, [{
		key: 'selectedIndex',
		set: function set(index) {
			if (this._selectedIndex !== index) {
				this._selectedIndex = index;
				this.notify({
					object: this,
					eventName: 'propertyChange',
					propertyName: 'selectedIndex',
					value: index
				});
			}
		},
		get: function get() {
			return this._selectedIndex;
		}
	}, {
		key: 'iconClose',
		get: function get() {
			return this._iconClose;
		}
	}, {
		key: 'iconBack',
		get: function get() {
			return this._iconBack;
		}
	}, {
		key: 'iconSearch',
		get: function get() {
			return this._iconSearch;
		}
	}, {
		key: 'iconMenu',
		get: function get() {
			return this._iconMenu;
		}
	}, {
		key: 'pageTitle',
		get: function get() {
			return this._pageTitle;
		}
	}, {
		key: 'backTitle',
		get: function get() {
			return this._backTitle;
		}
	}, {
		key: 'enabledTabs',
		get: function get() {
			return this._enabledTabs;
		}
	}, {
		key: 'txtDrugs',
		get: function get() {
			return this._txtDrugs;
		}
	}, {
		key: 'txtAdvice',
		get: function get() {
			return this._txtAdvice;
		}
	}]);

	return ActionBar;
})(_dataObservable.Observable);

exports['default'] = ActionBar;
module.exports = exports['default'];