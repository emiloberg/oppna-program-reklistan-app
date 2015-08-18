'use strict';

import {screen} from 'platform';
import {AbsoluteLayout} from 'ui/layouts/absolute-layout';
import {Animation} from 'ui/animation';
import {SwipeDirection} from 'ui/gestures';

const deviceWidth = screen.mainScreen.widthPixels / screen.mainScreen.scale;
const deviceHeight = screen.mainScreen.heightPixels / screen.mainScreen.scale;

let elMenu;
let elMainContent;
let curve;

const Mainmenu = {
	/**
	 * Setup menu on every page.
	 *
	 * @param mainContent Main content element
	 * @param menu Menu element
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
	},

	/**
	 * Show Menu
	 */
	show() {
		console.log('SHOWING');
		const animationsSetup = [
			{
				target: elMenu,
				translate: { x: -deviceWidth, y: 0 },
				duration: 250,
				delay: 0,
				iterations: 1,
				curve: curve
			},
			{
				target: elMainContent,
				opacity: 0.4,
				duration: 250,
				delay: 0,
				iterations: 1,
				curve: curve
			}
		];
		const menuAnimation = new Animation(animationsSetup, false);

		menuAnimation.play().finished
			.then(function () { return console.log('Animation done'); })
			.catch(function (e) { return console.log(e.message); });
	},

	/**
	 * Hide Menu
	 */
	hide() {
		const animationsSetup = [
			{
				target: elMenu,
				translate: { x: 0, y: 0 },
				duration: 250,
				delay: 0,
				iterations: 1,
				curve: curve
			},
			{
				target: elMainContent,
				opacity: 1,
				duration: 250,
				delay: 0,
				iterations: 1,
				curve: curve
			}
		];
		const menuAnimation = new Animation(animationsSetup, false);

		menuAnimation.play().finished
			.then(function () { return console.log('Animation done'); })
			.catch(function (e) { return console.log(e.message); });
	},


	swipe(args) {
		if (args.direction === SwipeDirection.right) {
			Mainmenu.hide();
		}

	}

};

export default Mainmenu;
