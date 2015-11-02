'use strict';

//import {debug} from './../shared/utils/debug';
import customUi from './../shared/modules/ui';
import ActionBar from './../shared/viewmodel/ActionBar';
import navigation from './../shared/utils/navigation';
import {android} from 'application';

function loaded(args) {
	customUi.setViewDefaults();
	let page = args.object;
	let navContext = page.navigationContext;
	let url = navContext.url;
	let wv = page.getViewById('externalWV');

	/**
	 * As the WebView on Android does not show PDFs, we're sending
	 * the PDF through Google's Document Viewer.
	 *
	 * It would be a nicer solution to look at the response header
	 * to figure out if it's a PDF or not, but for now, looking at
	 * the url will suffice
	 */
	if (android) {
		var parsedURL = /^.*?\.pdf(?:\?.*)?$/i.exec(url);
		if (parsedURL) {
			url = 'https://docs.google.com/gview?embedded=true&url=' + encodeURIComponent(parsedURL[0]);
		}
	}

	wv.src = url;

	let actionBar = new ActionBar();
	let elActionBar = page.getViewById('actionbar');
	elActionBar.bindingContext = actionBar;
}

module.exports.loaded = loaded;
module.exports.backTap = navigation.back;
module.exports.swipe = function(args) { navigation.swipe(args, '', ['back']); };
