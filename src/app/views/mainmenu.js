'use strict';

import {inspect} from './../shared/utils/debug';

import {templatesModel} from './../shared/utils/htmlRenderer';
import customUi from './../shared/modules/ui';
import ActionBar from './../shared/viewmodel/ActionBar';
import navigation from './../shared/utils/navigation';
import ResourceArticles from './../shared/viewmodel/ResourceArticles';
import {android, ios} from 'application';

//const frameModule = require('ui/frame');

function pageLoaded(args) {
	customUi.setViewDefaults();
	let page = args.object;
	let navContext = page.navigationContext;
	let actionBar = new ActionBar('', navContext.prevPageTitle, 0);
	let elActionBar = page.getViewById('actionbar');
	elActionBar.bindingContext = actionBar;


	let pageBindingContext = {
		resourceArticles: ResourceArticles.get()
	};

	let elPageContent = page.getViewById('pagecontent');
	elPageContent.bindingContext = pageBindingContext;


	inspect('Navigating to main menu');



}

function resourceArticleTap(args) {
	inspect(args.view.bindingContext);
	// TODO WORK HERE.
}

exports.pageLoaded = pageLoaded;
module.exports.backTap = navigation.back;
module.exports.resourceArticleTap = resourceArticleTap;
module.exports.swipe = function(args) {
	navigation.swipe(args, '', ['back', 'menu']);
};
module.exports.developerTap = function() {
	navigation.toDeveloper('');
};
