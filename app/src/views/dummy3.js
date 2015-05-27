'use strict';

import navigation from './../shared/utils/navigation';
import {inspect} from './../shared/utils/debug';

//   #/advice/Fysisk_aktivitet

//

//let appViewModel = require('./../shared/viewmodel/RekAppViewModel');

import {appViewModel} from './../shared/viewmodel/RekAppViewModel';

function navigatingTo() {

	navigation.navigateToUrl('advice/Diabetes/Riktvarden_och_omvandlingstabell', 'Previous page');

	//appViewModel.getSpecific('advice', 'Diabetes', 'Riktvarden_och_omvandlingstabell')
	//.then(function (e) {
	//	inspect(e);
	//}).catch(function (e) {
	//	console.log(e);
	//});
	//console.log(appViewModel.getSpecific('advice', 'Blod9', 'Riktvarden_och_omvandlingstabell'));
}

module.exports.navigatingTo = navigatingTo;
