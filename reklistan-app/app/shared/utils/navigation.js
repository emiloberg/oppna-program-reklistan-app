'use strict';

//import {inspect} from './../utils/debug';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _viewmodelRekAppViewModel = require('./../viewmodel/RekAppViewModel');

var _utilsDebug = require('./../utils/debug');

var gestures = require('ui/gestures');
var frameModule = require('ui/frame');

var utils = require('./../utils/utils');

var dialogs = require('ui/dialogs');

var navigation = {
	swipe: function swipe(args, pageTitle) {
		var allowedGestures = arguments.length <= 2 || arguments[2] === undefined ? ['back', 'search'] : arguments[2];

		if (allowedGestures.indexOf('back') > -1 && args.direction === gestures.SwipeDirection.right) {
			frameModule.topmost().goBack();
		}

		if (allowedGestures.indexOf('search') > -1 && args.direction === gestures.SwipeDirection.down) {
			navigation.toSearch(pageTitle);
		}
	},

	back: function back() {
		frameModule.topmost().goBack();
	},

	toSearch: function toSearch(prevPageTitle) {
		frameModule.topmost().navigate({
			moduleName: 'views/search',
			context: {
				prevPageTitle: prevPageTitle
			}
		});
	},

	toMenu: function toMenu(prevPageTitle) {
		frameModule.topmost().navigate({
			moduleName: 'views/mainmenu',
			context: {
				prevPageTitle: prevPageTitle
			}
		});
	},

	toDeveloper: function toDeveloper(prevPageTitle) {
		frameModule.topmost().navigate({
			moduleName: 'views/developer',
			context: {
				prevPageTitle: prevPageTitle
			}
		});
	},

	navigateToUrl: function navigateToUrl(url, prevPageTitle) {
		utils.promiseInternalUrlToArray(url).then(_viewmodelRekAppViewModel.appViewModel.getSpecific).then(function (specific) {
			var moduleName = undefined;
			if (specific.itemType === 'details') {
				moduleName = 'views/details';
			} else if (specific.itemType === 'chapter') {
				moduleName = 'views/menu-chapters';
			}
			frameModule.topmost().navigate({
				moduleName: moduleName,
				context: {
					data: specific.data,
					selectedIndex: specific.selectedIndex,
					prevPageTitle: prevPageTitle
				}
			});
		})['catch'](function (err) {
			console.log(err);
			// Todo, something with the error
			//dialogs.alert('FEL 2').then(function() {
			//	console.log('Dialog closed!');
			//});
		});
	},

	navigateToExternalUrl: function navigateToExternalUrl(url, prevPageTitle) {
		frameModule.topmost().navigate({
			moduleName: 'views/external-web',
			context: {
				url: url,
				prevPageTitle: prevPageTitle
			}
		});
	}

};

exports['default'] = navigation;
module.exports = exports['default'];