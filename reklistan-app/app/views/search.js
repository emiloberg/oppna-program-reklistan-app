'use strict';

// Todo, hide search button and maybe menu button and maybe back button

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _sharedUtilsDebug = require('./../shared/utils/debug');

var _sharedViewmodelActionBar = require('./../shared/viewmodel/ActionBar');

var _sharedViewmodelActionBar2 = _interopRequireDefault(_sharedViewmodelActionBar);

var _sharedModelSearchResultItem = require('./../shared/model/SearchResultItem');

var _sharedModelSearchResultItem2 = _interopRequireDefault(_sharedModelSearchResultItem);

var _sharedViewmodelSearch = require('./../shared/viewmodel/Search');

var _sharedViewmodelSearch2 = _interopRequireDefault(_sharedViewmodelSearch);

var _dataObservable = require('data/observable');

var _dataObservableArray = require('data/observable-array');

var _sharedUtilsLanguage = require('./../shared/utils/language');

var _sharedUtilsLanguage2 = _interopRequireDefault(_sharedUtilsLanguage);

var _sharedUtilsNavigation = require('./../shared/utils/navigation');

var _sharedUtilsNavigation2 = _interopRequireDefault(_sharedUtilsNavigation);

var page = undefined;
var curPageName = _sharedUtilsLanguage2['default'].searchTitle;
var searchResults = new _dataObservableArray.ObservableArray([]);
var pageContent = new _dataObservable.Observable({
	searchResults: searchResults
});
var lastSearchWord = '';

var searchInput = new _dataObservable.Observable({
	searchPlaceholder: _sharedUtilsLanguage2['default'].searchPlaceholder,
	searchText: ''
});

function navigatingTo(args) {
	page = args.object;

	var prevPageTitle = '';
	if ('navigationContext' in page) {
		prevPageTitle = page.navigationContext.prevPageTitle || '';
	}

	var actionBar = new _sharedViewmodelActionBar2['default'](curPageName, prevPageTitle, 0, 'none');
	var elActionBar = page.getViewById('actionbar');
	elActionBar.bindingContext = actionBar;

	var searchBar = page.getViewById('searchbar');
	searchBar.bindingContext = searchInput;
	searchBar.focus();

	searchInput.on(_dataObservable.Observable.propertyChangeEvent, function (event) {
		doSearch(event.value);
	});

	var pagecontent = page.getViewById('pagecontent');
	pagecontent.bindingContext = pageContent;
}

function doSearch(searchFor) {
	var searchTerm = searchFor.trim();

	if (searchTerm === lastSearchWord) {
		return;
	}

	while (searchResults.length > 0) {
		searchResults.pop();
	}

	if (searchTerm.length >= 3) {
		_sharedViewmodelSearch2['default'].search(searchTerm).then(function (results) {
			results.forEach(function (result) {
				searchResults.push(new _sharedModelSearchResultItem2['default'](result.chapter, result.section, result.url, result.tabIndex));
			});
		});

		lastSearchWord = searchTerm;
	}
}

function searchItemTap(args) {
	var bc = args.view.bindingContext;
	_sharedUtilsNavigation2['default'].navigateToUrl(bc.url, curPageName);
}

module.exports.searchItemTap = searchItemTap;
module.exports.navigatingTo = navigatingTo;
module.exports.backTap = _sharedUtilsNavigation2['default'].back;
module.exports.swipe = function (args) {
	_sharedUtilsNavigation2['default'].swipe(args, curPageName);
};