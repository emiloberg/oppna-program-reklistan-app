'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _dataObservable = require('data/observable');

var RekDataList = (function (_Observable) {
	_inherits(RekDataList, _Observable);

	function RekDataList(title, items, sort, id) {
		_classCallCheck(this, RekDataList);

		_get(Object.getPrototypeOf(RekDataList.prototype), 'constructor', this).call(this);
		this._title = title;
		this._selectedIndex = 0;
		this._allItems = items;
		this._sort = sort === true;
		this._id = id;
	}

	_createClass(RekDataList, [{
		key: 'hasType',
		value: function hasType(type) {
			return this._allItems.some(function (item) {
				return item.hasType(type);
			});
		}
	}, {
		key: 'selectedIndex',
		get: function get() {
			return this._selectedIndex;
		},
		set: function set(index) {
			if (this._selectedIndex !== index) {

				this._selectedIndex = index;

				this.notify({
					object: this,
					eventName: 'propertyChange',
					propertyName: 'selectedIndex',
					value: index
				});

				this.notify({
					object: this,
					eventName: 'propertyChange',
					propertyName: 'items',
					value: this.items
				});
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
	}, {
		key: 'items',
		get: function get() {
			var _this = this;

			var filteredItems = this._allItems.filter(function (item) {
				return item.hasType(_this._selectedIndex);
			});
			if (this._sort) {
				filteredItems = filteredItems.sort(function (o1, o2) {
					return o1.getOrder(_this._selectedIndex) - o2.getOrder(_this._selectedIndex);
				});
			}
			return filteredItems;
		}
	}, {
		key: 'allItems',
		get: function get() {
			return this._allItems;
		}
	}]);

	return RekDataList;
})(_dataObservable.Observable);

exports['default'] = RekDataList;
module.exports = exports['default'];