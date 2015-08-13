'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utilsImages = require('./../utils/images');

var _utilsImages2 = _interopRequireDefault(_utilsImages);

var SearchResultItem = (function () {
	function SearchResultItem(chapter, section, url, type) {
		_classCallCheck(this, SearchResultItem);

		this._chapter = chapter;
		this._section = section;
		this._url = url;
		this._type = type;
	}

	_createClass(SearchResultItem, [{
		key: 'icon',
		get: function get() {
			if (this._type === 1) {
				return _utilsImages2['default'].advice;
			} else {
				return undefined;
			}
		}
	}, {
		key: 'chapter',
		get: function get() {
			return this._chapter;
		}
	}, {
		key: 'section',
		get: function get() {
			return this._section;
		}
	}, {
		key: 'url',
		get: function get() {
			return this._url;
		}
	}]);

	return SearchResultItem;
})();

exports['default'] = SearchResultItem;
module.exports = exports['default'];