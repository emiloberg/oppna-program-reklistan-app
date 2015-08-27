'use strict';


const gestures = require('ui/gestures');
const frameModule = require('ui/frame');
import {appViewModel} from './../viewmodel/RekAppViewModel';
import Mainmenu from './../viewmodel/Mainmenu';
const utils = require('./../utils/utils');
import AppMessage from './../viewmodel/AppMessage';

//import {inspect} from './../utils/debug';

const navigation = {
	swipe(args, pageTitle, allowedGestures = ['back', 'search', 'menu']) {
		if (allowedGestures.indexOf('back') > -1 && args.direction === gestures.SwipeDirection.right) {
			frameModule.topmost().goBack();
		}

		if (allowedGestures.indexOf('search') > -1 && args.direction === gestures.SwipeDirection.down) {
			navigation.toSearch(pageTitle);
		}

		if (allowedGestures.indexOf('menu') > -1 && args.direction === gestures.SwipeDirection.left) {
			Mainmenu.show();
		}
	},

	back() {
		frameModule.topmost().goBack();
	},

	toSearch(prevPageTitle) {
		frameModule.topmost().navigate({
			moduleName: 'views/search',
			context: {
				prevPageTitle: prevPageTitle
			}
		});
	},

	toDeveloper() {
		frameModule.topmost().navigate({
			moduleName: 'views/developer',
			context: {
				prevPageTitle: ''
			}
		});
	},

	toReloadData() {
		frameModule.topmost().navigate({
			moduleName: 'views/download-data',
			context: {
				prevPageTitle: ''
			}
			//animated: false
		});
	},

	navigateToUrl(url, prevPageTitle) {
		return new Promise(function (resolve) {
			resolve(utils.internalUrlToArray(url));
		})
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
			AppMessage.setMessage(err.message ? err.message : err, 'info');
		});
	},

	navigateToExternalUrl(url) {
		frameModule.topmost().navigate({
			moduleName: 'views/external-web',
			context: {
				url: url
			}
		});
	}


};

export default navigation;
