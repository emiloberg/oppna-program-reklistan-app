'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _sharedModulesUi = require('./../shared/modules/ui');

var _sharedModulesUi2 = _interopRequireDefault(_sharedModulesUi);

var _sharedUtilsDebug = require('./../shared/utils/debug');

var _sharedViewmodelActionBar = require('./../shared/viewmodel/ActionBar');

var _sharedViewmodelActionBar2 = _interopRequireDefault(_sharedViewmodelActionBar);

var frameModule = require('ui/frame');

var page = undefined;
var actionBar = undefined;

function navigatingTo(args) {
	_sharedModulesUi2['default'].setViewDefaults();
	page = args.object;
	actionBar = new _sharedViewmodelActionBar2['default']('Den här sidan', 'Förra sidan', 0);
	var elActionbar = page.getViewById('actionbar');
	var elPagecontent = page.getViewById('pagecontent');
	elActionbar.bindingContext = actionBar;
	elPagecontent.bindingContext = {
		apa: 'boll'
	};
}

module.exports.navigatingTo = navigatingTo;
module.exports.drugsTap = function drugsTap() {
	actionBar.selectedIndex = 0;
};
module.exports.adviceTap = function adviceTap() {
	actionBar.selectedIndex = 1;
};
module.exports.backTap = function backTap() {
	var topmost = frameModule.topmost();
	topmost.goBack();
};