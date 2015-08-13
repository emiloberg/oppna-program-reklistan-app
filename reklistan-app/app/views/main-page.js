'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _sharedUtilsDebug = require('./../shared/utils/debug');

var _sharedModulesUi = require('./../shared/modules/ui');

var _sharedModulesUi2 = _interopRequireDefault(_sharedModulesUi);

var _sharedUtilsNavigation = require('./../shared/utils/navigation');

var _sharedUtilsNavigation2 = _interopRequireDefault(_sharedUtilsNavigation);

var _dataObservable = require('data/observable');

var _sharedUtilsLanguage = require('./../shared/utils/language');

var _sharedUtilsLanguage2 = _interopRequireDefault(_sharedUtilsLanguage);

var frameModule = require('ui/frame');
//var labelModule = require('ui/label');
//var pageModule = require('ui/page');

var initApp = require('./../shared/utils/appInit');

var contextObj = new _dataObservable.Observable({
	rek: _sharedUtilsLanguage2['default'].splashREK,
	listan: _sharedUtilsLanguage2['default'].splashListan
});

var pageLoaded = function pageLoaded(args) {
	_sharedModulesUi2['default'].setViewDefaults();

	var page = args.object;
	page.bindingContext = contextObj;

	contextObj.set('loadingCount', 0);

	var loadingInterval = setInterval(function () {
		var curLoadingCount = contextObj.get('loadingCount') > 5 ? 0 : contextObj.get('loadingCount') + 1;
		contextObj.set('loadingCount', curLoadingCount);
	}, 200);

	initApp.init().then(function () {
		clearInterval(loadingInterval);
		contextObj.set('loadingCount', 0);
		//		navigation.navigateToUrl('advice/Diabetes/Diabetes_typ_2_behandlingsalgoritm_for_VGR', 'Previous page');
		//		navigation.navigateToUrl('advice/Alkohol_och_Tobak/Avvanjningsstod_for_tobak', 'Previous page');
		frameModule.topmost().navigate('views/menu-sections');
		// 		frameModule.topmost().navigate('views/search');
		//		frameModule.topmost().navigate('views/dummy3');
		//		frameModule.topmost().navigate('views/dummy4');
		//		frameModule.topmost().navigate('views/dummy4');
	})['catch'](function (e) {
		clearInterval(loadingInterval);
		console.dir(e.message);
		console.log('ERROR');
		contextObj.set('error', e.message);
	});
};

exports.pageLoaded = pageLoaded;

function showRekMenu() {
	frameModule.topmost().navigate('views/menu-sections');
}
exports.showRekMenu = showRekMenu;

//var factoryFunc = function () {
//	var label = new labelModule.Label();
//	label.text = 'Hello, world!';
//	var page = new pageModule.Page();
//	page.content = label;
//	return page;
//};
//