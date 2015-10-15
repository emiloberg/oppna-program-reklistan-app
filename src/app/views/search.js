'use strict';

import ActionBar from './../shared/viewmodel/ActionBar';
import SearchResultItem from './../shared/model/SearchResultItem';
import search from './../shared/viewmodel/Search';
import {Observable} from 'data/observable';
import {ObservableArray} from 'data/observable-array';
import language from './../shared/utils/language';
import navigation from './../shared/utils/navigation';
import Mainmenu from './../shared/viewmodel/Mainmenu';
import AppMessage from './../shared/viewmodel/AppMessage';
import {AbsoluteLayout} from 'ui/layouts/absolute-layout';
//import {time, timeEnd, timePeek, inspect} from './../shared/utils/debug';
import screenDimensions from './../shared/utils/screenDimensions';

let page;
let curPageName = language.searchTitle;
let searchResults = new ObservableArray([]);
let lastSearchWord = '';
let pageContent = new Observable({
	searchResults: searchResults,
	noSearchResultsFound: ''
});
let searchBar;

var searchInput = new Observable({
	searchPlaceholder: language.searchPlaceholder,
	searchText: ''
});

function loaded(args) {
	//if (!page) {
	init(args);
	//}
}

function init(args) {
	page = args.object;


	// Elements
	const elPageWrapper = page.getViewById('pagewrapper');
	const elPageContent = page.getViewById('pagecontent');
	const elActionBar = page.getViewById('actionbar');
	const elAppMessage = page.getViewById('appmessage');
	const elMenuWrapper = page.getViewById('menuwrapper');

	// Set size of absolute positioned items.
	elPageWrapper.height = screenDimensions.height;
	elPageWrapper.width = screenDimensions.width;
	elPageContent.height = screenDimensions.height;
	elPageContent.width = screenDimensions.width;
	elMenuWrapper.height = screenDimensions.height;
	elMenuWrapper.width = screenDimensions.width;
	AbsoluteLayout.setLeft(elMenuWrapper, screenDimensions.width);

	let actionBar = new ActionBar({
		pageTitle: curPageName,
		enabledTabs: 'none',
		useLastPageTitle: true,
		showSearchButton: false
	});
	elActionBar.bindingContext = actionBar;

	searchBar = page.getViewById('searchbar');
	searchBar.bindingContext = searchInput;

	searchInput.on(Observable.propertyChangeEvent, function (event) {
		doSearch(event.value);
	});

	// App Message
	elAppMessage.bindingContext = AppMessage.get();

	// Page content
	elPageContent.bindingContext = pageContent;

	// Set focus on input. Android doesn't seem to need it, but iOS do.
	searchBar.focus();

	// Menu
	// As this binding takes like 300ms for some reason, we bind it after the page has loaded
	// and hopes that the user doesn't press the menu before that.
	setTimeout(function() {
		elMenuWrapper.bindingContext = Mainmenu.setup(elPageContent, elMenuWrapper);
	}, 1000);

}

function doSearch(searchFor) {
	const searchTerm = searchFor.trim();
	if (searchTerm === lastSearchWord) {
		return;
	}
	lastSearchWord = searchTerm;
	while(searchResults.length > 0) {
		searchResults.pop();
	}
	if (searchTerm.length >= 3) {
		search.search(searchTerm)
		.then(results => {
			results.forEach(result => {
				searchResults.push(new SearchResultItem(result.chapter, result.section, result.url, result.tabIndex));
			});

			if (results.length === 0) {
				pageContent.noSearchResultsFound = language.searchNoSearchResultsFound;
			} else {
				pageContent.noSearchResultsFound = '';
			}
		});
	}
}

function searchItemTap(args) {
	hideKeyboard();
	navigation.navigateToUrl(args.view.bindingContext.url, curPageName);
}

function hideKeyboard() {
	if (searchBar.android) {
		searchBar.android.clearFocus();
	} else if (searchBar.ios) {
		searchBar.ios.endEditing(true);
	}
}

module.exports.searchItemTap = searchItemTap;
module.exports.loaded = loaded;
module.exports.navigatingFrom = hideKeyboard;
//module.exports.swipe = function(args) {
//	navigation.swipe(args, curPageName, ['back', 'menu']);
//};
