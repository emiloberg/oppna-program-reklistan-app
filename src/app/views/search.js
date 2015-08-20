'use strict';

// Todo, hide search button and maybe menu button and maybe back button

import {inspect} from './../shared/utils/debug';
import ActionBar from './../shared/viewmodel/ActionBar';
import SearchResultItem from './../shared/model/SearchResultItem';
import search from './../shared/viewmodel/Search';
import {Observable} from 'data/observable';
import {ObservableArray} from 'data/observable-array';
import language from './../shared/utils/language';
import navigation from './../shared/utils/navigation';
import Mainmenu from './../shared/viewmodel/Mainmenu';

let page;
let curPageName = language.searchTitle;
let searchResults = new ObservableArray([]);
let pageContent = new Observable({
	searchResults: searchResults
});
let lastSearchWord = '';

var searchInput = new Observable({
	searchPlaceholder: language.searchPlaceholder,
	searchText: ''
});


function loaded(args) {
	page = args.object;
	Mainmenu.setup(page.getViewById('maincontent'), page.getViewById('menuwrapper'));

	let prevPageTitle = '';
	if ('navigationContext' in page) {
		prevPageTitle = page.navigationContext.prevPageTitle || '';
	}

	let actionBar = new ActionBar(curPageName, prevPageTitle, 0, 'none');
	let elActionBar = page.getViewById('actionbar');
	elActionBar.bindingContext = actionBar;

	let searchBar = page.getViewById('searchbar');
	searchBar.bindingContext = searchInput;
	searchBar.focus();

	searchInput.on(Observable.propertyChangeEvent, function (event) {
		doSearch(event.value);
	});

	let pagecontent = page.getViewById('pagecontent');
	pagecontent.bindingContext = pageContent;
}


function doSearch(searchFor) {
	const searchTerm = searchFor.trim();

	if (searchTerm === lastSearchWord) {
		return;
	}

	while(searchResults.length > 0) {
		searchResults.pop();
	}

	if (searchTerm.length >= 3) {
		search.search(searchTerm)
		.then(results => {
			results.forEach(result => {
				searchResults.push(new SearchResultItem(result.chapter, result.section, result.url, result.tabIndex));
			});
		});

		lastSearchWord = searchTerm;
	}
}


function searchItemTap(args) {
	var bc = args.view.bindingContext;
	navigation.navigateToUrl(bc.url, curPageName);
}


module.exports.searchItemTap = searchItemTap;
module.exports.loaded = loaded;
module.exports.backTap = navigation.back;
module.exports.swipe = function(args) {
	navigation.swipe(args, curPageName, ['back', 'menu']);
};
module.exports.menuTap = Mainmenu.show;
module.exports.hideMenuTap = Mainmenu.hide;
module.exports.swipeMenu = function(args) {
	Mainmenu.swipe(args);
};
