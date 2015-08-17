import {Animation} from 'ui/animation';
import {screen} from 'platform';
import {AbsoluteLayout} from 'ui/layouts/absolute-layout';

let elMenu;
let elMainContent;
let menuAnimation;

const deviceWidth = screen.mainScreen.widthPixels / screen.mainScreen.scale;
const deviceHeight = screen.mainScreen.heightPixels / screen.mainScreen.scale;

function pageLoaded(args) {
	const page = args.object;

	elMenu = page.getViewById('menuwrapper');
	elMainContent = page.getViewById('maincontent');

	AbsoluteLayout.setLeft(elMenu, deviceWidth); // Push menu off screen
	elMenu.width = deviceWidth ; // Set menu to 100% width
	elMenu.height = deviceHeight; // Set menu to 100% height
}


function showMenu() {
	const curve = elMenu.ios ? UIViewAnimationCurve.UIViewAnimationCurveEaseIn : new android.view.animation.AccelerateInterpolator(1);
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
			opacity: 0.5,
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
}


function hideMenu() {
	const curve = elMenu.ios ? UIViewAnimationCurve.UIViewAnimationCurveEaseIn : new android.view.animation.AccelerateInterpolator(1);
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
}

exports.loaded = pageLoaded;
exports.showMenuTap = showMenu;
exports.hideMenuTap = hideMenu;