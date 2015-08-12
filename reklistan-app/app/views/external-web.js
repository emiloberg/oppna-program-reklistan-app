'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _sharedUtilsDebug = require('./../shared/utils/debug');

var _sharedUtilsHtmlRenderer = require('./../shared/utils/htmlRenderer');

var _sharedModulesUi = require('./../shared/modules/ui');

var _sharedModulesUi2 = _interopRequireDefault(_sharedModulesUi);

var _sharedViewmodelActionBar = require('./../shared/viewmodel/ActionBar');

var _sharedViewmodelActionBar2 = _interopRequireDefault(_sharedViewmodelActionBar);

var _sharedUtilsNavigation = require('./../shared/utils/navigation');

var _sharedUtilsNavigation2 = _interopRequireDefault(_sharedUtilsNavigation);

var _application = require('application');

//const frameModule = require('ui/frame');

function navigatingTo(args) {
	_sharedModulesUi2['default'].setViewDefaults();
	var page = args.object;
	var navContext = page.navigationContext;

	var wv = page.getViewById('externalWV');
	wv.src = navContext.url;

	var actionBar = new _sharedViewmodelActionBar2['default']('', navContext.prevPageTitle, 0);
	var elActionBar = page.getViewById('actionbar');
	elActionBar.bindingContext = actionBar;

	(0, _sharedUtilsDebug.inspect)('Navigating to external web view');
}

module.exports.navigatingTo = navigatingTo;
module.exports.backTap = _sharedUtilsNavigation2['default'].back;
module.exports.swipe = function (args) {
	_sharedUtilsNavigation2['default'].swipe(args, '', ['back']);
};