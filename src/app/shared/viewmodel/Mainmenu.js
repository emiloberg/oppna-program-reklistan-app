
'use strict';

import {Animation} from 'ui/animation';
const gestures = require('ui/gestures');
import {Observable} from 'data/observable';
import ResourceArticles from './ResourceArticles';
import News from './News';
import {debug /*, time, timeEnd, timePeek, inspect*/} from './../utils/debug';
import Images from './../utils/images';
import navigation from './../utils/navigation';
import language from './../utils/language';
import Metadata from './Metadata';
var appversion = require('nativescript-appversion');
import screenDimensions from './../utils/screenDimensions';

let elMenu;
let elMainContent;
let curveIn;
let curveOut;

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

		// Setup curve
		/*global UIViewAnimationCurve,android*/
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

		// If bindingContext isn't binded yet - silently exit.
		if(typeof elMenu === 'undefined' || typeof elMainContent === 'undefined') {
			return;
		}

		const animationsSetup = [
			{
				target: elMenu,
				translate: { x: -screenDimensions.width, y: 0 },
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
				translate: { x: screenDimensions.width, y: 0 },
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
		if (args.direction === gestures.SwipeDirection.right) {
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
