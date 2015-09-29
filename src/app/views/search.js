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
import {screen} from 'platform';
import {time, timeEnd, timePeek, inspect} from './../shared/utils/debug';
const deviceWidth = screen.mainScreen.widthPixels / screen.mainScreen.scale;
const deviceHeight = screen.mainScreen.heightPixels / screen.mainScreen.scale;

let page;
let curPageName = language.searchTitle;
let searchResults = new ObservableArray([]);
let lastSearchWord = '';
let pageContent = new Observable({
	searchResults: searchResults
});

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
	elPageWrapper.height = deviceHeight;
	elPageWrapper.width = deviceWidth;
	elPageContent.height = deviceHeight;
	elPageContent.width = deviceWidth;
	elMenuWrapper.height = deviceHeight;
	elMenuWrapper.width = deviceWidth;
	AbsoluteLayout.setLeft(elMenuWrapper, deviceWidth);

	let actionBar = new ActionBar({
		pageTitle: curPageName,
		enabledTabs: 'none',
		useLastPageTitle: true,
		showSearchButton: false
	});
	elActionBar.bindingContext = actionBar;

	let searchBar = page.getViewById('searchbar');
	searchBar.bindingContext = searchInput;
	searchBar.focus();

	searchInput.on(Observable.propertyChangeEvent, function (event) {
		doSearch(event.value);
	});

	// Menu
	elMenuWrapper.bindingContext = Mainmenu.setup(elPageContent, elMenuWrapper);

	// App Message
	elAppMessage.bindingContext = AppMessage.get();

	// Page content
	elPageContent.bindingContext = pageContent;

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
		})
	}
}

function searchItemTap(args) {
	var bc = args.view.bindingContext;
	navigation.navigateToUrl(bc.url, curPageName);
}

module.exports.searchItemTap = searchItemTap;
module.exports.loaded = loaded;
//module.exports.swipe = function(args) {
//	navigation.swipe(args, curPageName, ['back', 'menu']);
//};
