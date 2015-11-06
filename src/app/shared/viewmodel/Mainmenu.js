'use strict';

import {Observable} from 'data/observable';
import ResourceArticles from './ResourceArticles';
import News from './News';
import Images from './../utils/images';
import navigation from './../utils/navigation';
import language from './../utils/language';
import Metadata from './Metadata';
import * as frameModule from 'ui/frame';
//import {debug /*, time, timeEnd, timePeek, inspect*/} from './../utils/debug';

var appversion = require('nativescript-appversion');

let enterDebugTapCounter = 0;
let enterDebugLastTap = 0;

const DEBUG_MODE_MAX_MS = 5000;
const DEBUG_MODE_TAPS = 3;

let MAIN_MENU_DATA = new Observable({
	resourceArticles: ResourceArticles.get(),
	vgrLogoImage: Images.mainmenuVGRLogo,
	text: {
		mainmenuHeadingNews: language.mainmenuHeadingNews,
		mainmenuHeadingResourceArticles: language.mainmenuHeadingResourceArticles,
		mainmenuHeadingSettings: language.mainmenuHeadingSettings,
		mainmenuLabelReloadData: language.mainmenuLabelReloadData
	},
	news: News.get(),
	metadata: Metadata.getMetadata(),
	footer: language.appTitle
});

function setAppVersion() {
	appversion.getVersionName().then(function (v) {
		MAIN_MENU_DATA.set('footer', language.mainmenuLabelFooter + v);
	});
}

const Mainmenu = {
	show() {
		frameModule.topmost().getViewById('sideDrawer').showDrawer();
	},

	get() {
		return MAIN_MENU_DATA;
	},

	setup() {
		setTimeout(function () {
			News.loadIfNeeded();
		}, 0);

		setAppVersion();
	},

	/**
	 * Will open the debug view if clicked more than X times.
	 */
	logoTap() {
		const curTime = new Date().getTime();
		if ((curTime - enterDebugLastTap) > DEBUG_MODE_MAX_MS) {
			enterDebugLastTap = curTime;
			enterDebugTapCounter = 1;
		} else {
			enterDebugTapCounter += 1;
		}

		if (enterDebugTapCounter > DEBUG_MODE_TAPS) {
			// TODO, hide menu
			navigation.toDeveloper();
		}
	},

	reloadDataTap() {
		// TODO, hide menu
		navigation.toReloadData();
	}

};

export default Mainmenu;
