'use strict';

// Todo, hide search button and maybe menu button and maybe back button

import {inspect} from './../shared/utils/debug';
import ActionBar from './../shared/viewmodel/ActionBar';
import {Observable} from 'data/observable';
import {ObservableArray} from 'data/observable-array';
import language from './../shared/utils/language';
import navigation from './../shared/utils/navigation';

let page;
let curPageName = language.searchTitle;
let searchResults = new ObservableArray([
	{
		chapter: 'String 1',
		section: 'Something Else',
		url: 'http1'
	}, {
		chapter: 'String 2',
		section: 'Something Else',
		url: 'http2'
	}
]);
let pageContent = new Observable({
	searchResults: searchResults
});

function navigatingTo(args) {
	page = args.object;
	let navContext = page.navigationContext;

	let actionBar = new ActionBar(curPageName, navContext.prevPageTitle, 0, 'none');
	let elActionBar = page.getViewById('actionbar');
	elActionBar.bindingContext = actionBar;

	var searchInput = new Observable({
		searchPlaceholder: language.searchPlaceholder,
		searchText: ''
	});

	let searchBar = page.getViewById('searchbar');
	searchBar.bindingContext = searchInput;

	searchInput.on(Observable.propertyChangeEvent, function (event) {
		doSearch(event.value);
	});

	let pagecontent = page.getViewById('pagecontent');
	pagecontent.bindingContext = pageContent;

	setTimeout(function () {
		searchResults.push({
			chapter: 'String 3',
			section: 'Something Else',
			url: 'http3'
		});
	}, 2000);

}

function doSearch(searchFor) {
	//todo Perform search here
}

module.exports.navigatingTo = navigatingTo;
module.exports.backTap = navigation.back;
module.exports.swipe = function(args) {
	navigation.swipe(args, curPageName);
};

