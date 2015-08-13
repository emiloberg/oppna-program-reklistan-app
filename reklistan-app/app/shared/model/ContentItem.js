'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var TYPENAMES = ['drugs', 'advice'];

var ContentItem = (function () {
	function ContentItem(title, content, order, id) {
		_classCallCheck(this, ContentItem);

		this._title = title;
		this._content = content;
		this._order = order;
		this._id = id;
	}

	_createClass(ContentItem, [{
		key: 'getContent',
		value: function getContent(typeNameOrId) {
			if (typeof typeNameOrId === 'number') {
				return this._content[TYPENAMES[typeNameOrId]];
			} else {
				return this._content[typeNameOrId];
			}
		}
	}, {
		key: 'getOrder',
		value: function getOrder(typeNameOrId) {
			if (typeof typeNameOrId === 'number') {
				return this._order[TYPENAMES[typeNameOrId]];
			} else {
				return this._order[typeNameOrId];
			}
		}
	}, {
		key: 'hasType',
		value: function hasType(typeNameOrId) {
			if (typeof typeNameOrId === 'number') {
				return this._content.hasOwnProperty(TYPENAMES[typeNameOrId]);
			} else {
				return this._content.hasOwnProperty(typeNameOrId);
			}
		}
	}, {
		key: 'title',
		get: function get() {
			return this._title;
		}
	}, {
		key: 'id',
		get: function get() {
			return this._id;
		}
	}]);

	return ContentItem;
})();

exports['default'] = ContentItem;
module.exports = exports['default'];