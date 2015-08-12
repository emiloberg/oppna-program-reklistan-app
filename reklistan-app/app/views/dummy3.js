'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _sharedUtilsNavigation = require('./../shared/utils/navigation');

var _sharedUtilsNavigation2 = _interopRequireDefault(_sharedUtilsNavigation);

var _sharedUtilsDebug = require('./../shared/utils/debug');

//   #/advice/Fysisk_aktivitet

//

//let appViewModel = require('./../shared/viewmodel/RekAppViewModel');

var _sharedViewmodelRekAppViewModel = require('./../shared/viewmodel/RekAppViewModel');

function navigatingTo() {

	_sharedUtilsNavigation2['default'].navigateToUrl('advice/Diabetes/Riktvarden_och_omvandlingstabell', 'Previous page');
	//navigation.navigateToUrl('advice/Diabetes/asdf/asdf', 'Previous page');

	//appViewModel.getSpecific('advice', 'Diabetes', 'Riktvarden_och_omvandlingstabell')
	//.then(function (e) {
	//	inspect(e);
	//}).catch(function (e) {
	//	console.log(e);
	//});
	//console.log(appViewModel.getSpecific('advice', 'Blod9', 'Riktvarden_och_omvandlingstabell'));
}

module.exports.navigatingTo = navigatingTo;