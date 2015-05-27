'use strict';

import {inspect} from './../utils/debug';

const gestures = require('ui/gestures');
const frameModule = require('ui/frame');
import {appViewModel} from './../viewmodel/RekAppViewModel';

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
		let params = url.split('/');
		WORK HERE
		if (params.length < 2 && params.length > 3) {
			// todo add error handling for invalid urls
		}

		if (params.length < 3) {
			params.push(undefined);
		}

		//appViewModel.getSpecific('advice', 'Diabetes', 'Riktvarden_och_omvandlingstabell')
		appViewModel.getSpecific(params[0], params[1], params[2])
			.then(function (e) {
				let moduleName;
				if (e.itemType === 'details') {
					moduleName = 'views/details';
				} else if (e.itemType === 'chapter' ) {
					moduleName = 'views/menu-chapters';
				}

				frameModule.topmost().navigate({
					moduleName: moduleName,
					context: {
						data: e.data,
						selectedIndex: e.selectedIndex,
						prevPageTitle: prevPageTitle
					}
				});

			}).catch(function (e) {
				console.log(e);
				// Todo, something with the error
			});
	}

};

export default navigation;
