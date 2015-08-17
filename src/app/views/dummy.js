const animationModule = require("ui/animation");
import {screen} from 'platform';
import {inspect, saveFile} from './../shared/utils/debug';

import {AbsoluteLayout} from 'ui/layouts/absolute-layout';

let page;
let elMenu;

const deviceWidth = screen.mainScreen.widthPixels / screen.mainScreen.scale;
const deviceHeight = screen.mainScreen.heightPixels / screen.mainScreen.scale;

function pageLoaded(args) {
	page = args.object;
	elMenu = page.getViewById('menuwrapper');

	AbsoluteLayout.setLeft(elMenu, deviceWidth); // Push menu off screen
	elMenu.width = deviceWidth ; // Set menu to 100% width
	elMenu.height = deviceHeight;
}

function animateOut(args) {
	console.log('Start Animate out!');

	elMenu.animate({
		//opacity: 0.75,
		//rotate: 180,
		//scale: { x: 2, y: 2 },
		//backgroundColor: new colorModule.Color("Red"),
		translate: { x: -deviceWidth, y: 0 },
		duration: 250,
		delay: 0,
		iterations: 1,
		curve: elMenu.ios ? UIViewAnimationCurve.UIViewAnimationCurveEaseIn : new android.view.animation.AccelerateInterpolator(1)
	});

	//var buttonAnimations = [
	//	{ target: elMenu, translate: { x: -240, y: 0 }, scale: { x: 0.5, y: 0.5 }, opacity: 0, duration: 3000, delay: 0, iterations: 0, curve: curve }
	//];
	//let buttonAnimation = new animationModule.Animation(buttonAnimations, false);
	//
	////panelAnimation = panel.createAnimation({ opacity: 0, scale: { x: 0.5, y: 0.5 }, rotate: -360, backgroundColor: new colorModule.Color("red"), duration: vm.duration, iterations: vm.iterations });
	//buttonAnimation.play().finished
	//	//.then(function () { return panelAnimation.play().finished; })
	//	.catch(function (e) { return console.log(e.message); });

}

function whiteoutTap() {
	elMenu.animate({
		//opacity: 0.75,
		//rotate: 180,
		//scale: { x: 2, y: 2 },
		//backgroundColor: new colorModule.Color("Red"),
		translate: { x: 0, y: 0 },
		duration: 250,
		delay: 0,
		iterations: 1,
		curve: elMenu.ios ? UIViewAnimationCurve.UIViewAnimationCurveEaseIn : new android.view.animation.AccelerateInterpolator(1)
	});
}

exports.loaded = pageLoaded;
exports.animateOut = animateOut;
exports.whiteoutTap = whiteoutTap;