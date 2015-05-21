'use strict';

//var FrameModule = require('ui/frame');
//var PageModule = require('ui/page');
////var LabelModule = require('ui/label');
////var StackLayoutModule = require('ui/layouts/stack-layout');
//var webViewModule = require('ui/web-view');

var gestures = require('ui/gestures');

import Images from './../shared/utils/images';

var page;

function loaded() {}

function navigatedTo(args) {
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
	//
	//let backButton = page.getViewById('action-bar--back-button');
	//
	//var observer = backButton.observe(gestures.GestureTypes.Tap, function (args) {
	//	console.log("Tap");
	//});


	//listView.on(listViewModule.ListView.itemTapEvent, function (args) {
	//	var tappedItemIndex = args.index;
	//	var tappedItemView = args.view;
	//	// Do someting
	//});

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
