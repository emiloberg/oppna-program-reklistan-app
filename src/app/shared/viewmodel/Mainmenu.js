
'use strict';

import {screen} from 'platform';
import {AbsoluteLayout} from 'ui/layouts/absolute-layout';
import {Animation} from 'ui/animation';
import {SwipeDirection} from 'ui/gestures';
import {Observable} from 'data/observable';
import ResourceArticles from './ResourceArticles';
import News from './News';
import {inspect, debug} from './../utils/debug';
import Images from './../utils/images';
import navigation from './../utils/navigation';
import language from './../utils/language';
import Metadata from './Metadata';
var appversion = require('nativescript-appversion');

const deviceWidth = screen.mainScreen.widthPixels / screen.mainScreen.scale;
const deviceHeight = screen.mainScreen.heightPixels / screen.mainScreen.scale;

let elMenu;
let elMainContent;
let curveIn;
let curveOut;

let enterDebugTapCounter = 0;
let enterDebugLastTap = 0;

const DEBUG_MODE_MAX_MS = 2000;
const DEBUG_MODE_TAPS = 5;

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
	footer: ''
});

appversion.getVersionName().then(function(v) {
	MAIN_MENU_DATA.set('footer', language.mainmenuLabelFooter + v);
});

const Mainmenu = {

	/**
	 * Setup menu on every page.
	 *
	 * @param mainContent Main content element
	 * @param menu Menu element
	 * @return Main menu observable object
	 */
	setup(mainContent, menu) {
		elMenu = menu;
		elMainContent = mainContent;

		//// iOS appbar is not included when we get deviceHeight, therefor we need include it.
		//let potentialIOSBar = elMenu.ios ? 20 : 0;
		//
		//// Make sure main content takes all available space
		//elMainContent.height = deviceHeight - potentialIOSBar;
		//elMainContent.width = deviceWidth;
		//
		//// Make sure menu takes all available space
		//elMenu.height = deviceHeight - potentialIOSBar;
		//elMenu.width = deviceWidth;
		//
		//// Push menu off screen
		//AbsoluteLayout.setLeft(elMenu, deviceWidth);
		//
		// Setup curve
		curveIn = elMenu.ios ? UIViewAnimationCurve.UIViewAnimationCurveEaseOut : new android.view.animation.DecelerateInterpolator(1);
		curveOut = elMenu.ios ? UIViewAnimationCurve.UIViewAnimationCurveEaseIn : new android.view.animation.AccelerateInterpolator(1);

		// Load News
		setTimeout(function () {
			News.loadIfNeeded();
		}, 0);

		return MAIN_MENU_DATA;
	},


	/**
	 * Show Menu
	 */
	show() {
		const animationsSetup = [
			{
				target: elMenu,
				translate: { x: -deviceWidth, y: 0 },
				duration: 350,
				delay: 0,
				iterations: 1,
				curve: curveIn
			},
			{
				target: elMainContent,
				opacity: 0.4,
				duration: 350,
				delay: 0,
				iterations: 1,
				curve: curveIn
			}
		];
		const menuAnimation = new Animation(animationsSetup, false);

		menuAnimation.play().finished
			.catch(function (e) {
				debug(e.message, 'error');
			});
	},

	/**
	 * Hide Menu
	 */
	hide(cb) {
		const animationsSetup = [
			{
				target: elMenu,
				translate: { x: deviceWidth, y: 0 },
				duration: 350,
				delay: 0,
				iterations: 1,
				curve: curveOut
			},
			{
				target: elMainContent,
				opacity: 1,
				duration: 350,
				delay: 0,
				iterations: 1,
				curve: curveOut
			}
		];
		const menuAnimation = new Animation(animationsSetup, false);

		menuAnimation.play().finished
			.then(function () {
				if(cb && typeof cb === 'function') {
					cb(null, 'Done');
				}
			})
			.catch(function (err) {
				if(cb && typeof cb === 'function') {
					debug(err, 'error');
					cb(err);
				}
			});
	},

	swipe(args) {
		if (args.direction === SwipeDirection.right) {
			Mainmenu.hide();
		}

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
			Mainmenu.hide(function() {
				navigation.toDeveloper();
			});
		}
	},

	reloadDataTap() {
		Mainmenu.hide(function() {
			navigation.toReloadData();
		});
	}

};

export default Mainmenu;
