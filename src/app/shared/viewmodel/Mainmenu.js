'use strict';

import {screen} from 'platform';
import {AbsoluteLayout} from 'ui/layouts/absolute-layout';
import {Animation} from 'ui/animation';
import {SwipeDirection} from 'ui/gestures';
import {Observable} from 'data/observable';
import {ObservableArray} from 'data/observable-array';
import ResourceArticles from './ResourceArticles';
import News from './News';
import {inspect} from './../utils/debug';
import Images from './../utils/images';
import navigation from './../utils/navigation';
import language from './../utils/language';

const deviceWidth = screen.mainScreen.widthPixels / screen.mainScreen.scale;
const deviceHeight = screen.mainScreen.heightPixels / screen.mainScreen.scale;

let elMenu;
let elMainContent;
let curve;

let enterDebugTapCounter = 0;
let enterDebugLastTap = 0;

const DEBUG_MODE_MAX_MS = 2000;
const DEBUG_MODE_TAPS = 5;

//var RESOURCE_ARTICLES = new ObservableArray(apa);
var MAIN_MENU_DATA = new Observable({
	resourceArticles: ResourceArticles.get(),
	vgrLogoImage: Images.mainmenuVGRLogo,
	text: {
		newsHeading: language.mainmenuNews,
		resourceHeading: language.mainmenuResouceArticles
	}
});

MAIN_MENU_DATA.news = News.get();


const Mainmenu = {
	/**
	 * Setup menu on every page.
	 *
	 * @param mainContent Main content element
	 * @param menu Menu element
	 * @return Main menu observable object
	 */
	setup(mainContent, menu) {
		elMainContent = mainContent;
		elMenu = menu;

		// Make sure main content takes all available space
		elMainContent.width = deviceWidth ;
		elMainContent.height = deviceHeight;

		// Push menu off screen
		AbsoluteLayout.setLeft(elMenu, deviceWidth);

		// Make sure menu takes all available space
		elMenu.width = deviceWidth ;
		elMenu.height = deviceHeight;

		// Setup curve
		curve = elMenu.ios ? UIViewAnimationCurve.UIViewAnimationCurveEaseIn : new android.view.animation.AccelerateInterpolator(1);

		News.loadIfNeeded();

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
				curve: curve
			},
			{
				target: elMainContent,
				opacity: 0.4,
				duration: 350,
				delay: 0,
				iterations: 1,
				curve: curve
			}
		];
		const menuAnimation = new Animation(animationsSetup, false);

		menuAnimation.play().finished
			//.then(function () { return console.log('Animation done'); })
			.catch(function (e) { return console.log(e.message); });
	},

	/**
	 * Hide Menu
	 */
	hide(cb) {
		const animationsSetup = [
			{
				target: elMenu,
				translate: { x: 0, y: 0 },
				duration: 350,
				delay: 0,
				iterations: 1,
				curve: curve
			},
			{
				target: elMainContent,
				opacity: 1,
				duration: 350,
				delay: 0,
				iterations: 1,
				curve: curve
			}
		];
		const menuAnimation = new Animation(animationsSetup, false);

		menuAnimation.play().finished
			.then(function () {
				if(cb && typeof cb == 'function') {
					cb(null, 'Done');
				}
			})
			.catch(function (err) {
				if(cb && typeof cb == 'function') {
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
			enterDebugTapCounter = 1
		} else {
			enterDebugTapCounter += 1;
		}

		if (enterDebugTapCounter > DEBUG_MODE_TAPS) {
			Mainmenu.hide(function() {
				navigation.toDeveloper();
			});
		}
	}

};

export default Mainmenu;
