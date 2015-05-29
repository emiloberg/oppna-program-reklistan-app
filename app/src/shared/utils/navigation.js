'use strict';

//import {inspect} from './../utils/debug';

const gestures = require('ui/gestures');
const frameModule = require('ui/frame');
import {appViewModel} from './../viewmodel/RekAppViewModel';

const utils = require('./../utils/utils');
const dialogs = require('ui/dialogs');


const navigation = {
	swipe(args) {
		if (args.direction === gestures.SwipeDirection.right) {
			frameModule.topmost().goBack();
		}
	},

	back() {
		frameModule.topmost().goBack();
	},

	navigateToUrl(url, prevPageTitle) {
		utils.internalUrlToArray(url)
		.then(appViewModel.getSpecific)
		.then(function (specific) {
			let moduleName;
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
		})
		.catch(function (err) {
			console.log(err);
			// Todo, something with the error
			//dialogs.alert('FEL 2').then(function() {
			//	console.log('Dialog closed!');
			//});

		});
	},

	navigateToExternalUrl(url, prevPageTitle) {
		frameModule.topmost().navigate({
			moduleName: 'views/external-web',
			context: {
				url: url,
				prevPageTitle: prevPageTitle
			}
		});
	}


};

export default navigation;
