'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _sharedUtilsDebug = require('./../shared/utils/debug');

var _sharedModulesUi = require('./../shared/modules/ui');

var _sharedModulesUi2 = _interopRequireDefault(_sharedModulesUi);

var _sharedUtilsLanguage = require('./../shared/utils/language');

var _sharedUtilsLanguage2 = _interopRequireDefault(_sharedUtilsLanguage);

var _sharedViewmodelActionBar = require('./../shared/viewmodel/ActionBar');

var _sharedViewmodelActionBar2 = _interopRequireDefault(_sharedViewmodelActionBar);

var _sharedUtilsNavigation = require('./../shared/utils/navigation');

var _sharedUtilsNavigation2 = _interopRequireDefault(_sharedUtilsNavigation);

var appViewModel = require('./../shared/viewmodel/RekAppViewModel');

var frameModule = require('ui/frame');

var page = undefined;
var actionBar = undefined;
var dataList = undefined;
var curPageName = _sharedUtilsLanguage2['default'].appTitle;

function navigatingTo(args) {
	_sharedModulesUi2['default'].setViewDefaults();
	page = args.object;

	actionBar = new _sharedViewmodelActionBar2['default'](curPageName, 'Förra sidan', 0);
	var elActionBar = page.getViewById('actionbar');
	elActionBar.bindingContext = actionBar;

	var elPageContent = page.getViewById('pagecontent');
	dataList = appViewModel.appViewModel.getMainDataList();
	elPageContent.bindingContext = dataList;
}

function menuItemTap(args) {
	var section = args.view.bindingContext;
	frameModule.topmost().navigate({
		moduleName: 'views/menu-chapters',
		context: {
			data: section,
			selectedIndex: dataList.selectedIndex,
			prevPageTitle: curPageName
		}
	});
}

function drugsTap() {
	actionBar.selectedIndex = 0;
	dataList.selectedIndex = 0;
}

function adviceTap() {
	actionBar.selectedIndex = 1;
	dataList.selectedIndex = 1;
}

module.exports.navigatingTo = navigatingTo;
module.exports.drugsTap = drugsTap;
module.exports.adviceTap = adviceTap;
module.exports.menuItemTap = menuItemTap;
module.exports.backTap = _sharedUtilsNavigation2['default'].back;
module.exports.swipe = function (args) {
	_sharedUtilsNavigation2['default'].swipe(args, curPageName);
};
module.exports.searchTap = function () {
	_sharedUtilsNavigation2['default'].toSearch(curPageName);
};
module.exports.menuTap = function () {
	_sharedUtilsNavigation2['default'].toMenu(curPageName);
};