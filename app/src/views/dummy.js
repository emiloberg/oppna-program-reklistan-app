'use strict';

import Images from './../shared/utils/images';
import customUi from './../shared/modules/ui';

var page;

function loaded() {
}

function navigatedTo(args) {
	customUi.setViewDefaults();
	page = args.object;
	page.bindingContext = {
		actionBar: {
			iconBack: Images.left,
			iconSearch: Images.search,
			iconMenu: Images.menu,
			backTitle: 'FÖREGÅENDE SIDA',
			pageTitle: 'DEN HÄR FINA SIDAN'
		}
	};

}

function drugsTap() {
	console.log('DRUGS');
}

function adviceTap() {
	console.log('ADVICE');
}





module.exports.loaded = loaded;
module.exports.navigatedTo = navigatedTo;
module.exports.drugsTap = drugsTap;
module.exports.adviceTap = adviceTap;
