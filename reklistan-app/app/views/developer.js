'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _sharedUtilsDebug = require('./../shared/utils/debug');

var debug = _interopRequireWildcard(_sharedUtilsDebug);

var _sharedModulesUi = require('./../shared/modules/ui');

var _sharedModulesUi2 = _interopRequireDefault(_sharedModulesUi);

var _sharedViewmodelActionBar = require('./../shared/viewmodel/ActionBar');

var _sharedViewmodelActionBar2 = _interopRequireDefault(_sharedViewmodelActionBar);

var _sharedUtilsNavigation = require('./../shared/utils/navigation');

var _sharedUtilsNavigation2 = _interopRequireDefault(_sharedUtilsNavigation);

function navigatingTo(args) {
	_sharedModulesUi2['default'].setViewDefaults();
	var page = args.object;
	var navContext = page.navigationContext;

	var actionBar = new _sharedViewmodelActionBar2['default']('', navContext.prevPageTitle, 0);
	var elActionBar = page.getViewById('actionbar');
	elActionBar.bindingContext = actionBar;

	var elLog = page.getViewById('log');
	elLog.bindingContext = debug.getDebugLog();
}

module.exports.navigatingTo = navigatingTo;
module.exports.backTap = _sharedUtilsNavigation2['default'].back;
module.exports.swipe = function (args) {
	_sharedUtilsNavigation2['default'].swipe(args, '', ['back']);
};
module.exports.removeLocalFilesTap = debug.removeLocalFiles;
module.exports.removeLocalImagesTap = debug.removeLocalImages;
module.exports.removeLocalCacheTap = debug.removeLocalCache;
module.exports.clearDebugLogTap = debug.clearDebugLog;