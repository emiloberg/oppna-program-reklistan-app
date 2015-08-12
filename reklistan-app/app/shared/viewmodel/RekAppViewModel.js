'use strict';

//import {inspect} from './../utils/debug';

Object.defineProperty(exports, '__esModule', {
	value: true
});
var MAIN_DATA_LIST = undefined;

var TABTYPES = ['drugs', 'advice'];

var appViewModel = {

	setMainDataList: function setMainDataList(mainDataList) {
		MAIN_DATA_LIST = mainDataList;
	},

	getMainDataList: function getMainDataList() {
		return MAIN_DATA_LIST;
	},

	getSpecific: function getSpecific(slugs) {

		var askedTypeNameOrId = slugs[0];
		var askedSection = slugs[1];
		var askedChapter = slugs[2];

		// Get type ID
		var askedTypeId = undefined;
		if (typeof askedTypeNameOrId === 'number') {
			askedTypeId = askedTypeNameOrId;
		} else {
			askedTypeId = TABTYPES.indexOf(askedTypeNameOrId);
		}

		// FILTER SECTIONS
		var filtered = MAIN_DATA_LIST.allItems.filter(function (section) {
			return section.id === askedSection;
		});

		if (filtered.length === 1) {
			filtered = filtered[0];
		} else {
			throw new Error('Page not found, error 1');
		}

		// Check if section exist for asked type
		if (filtered.hasType(askedTypeId) !== true) {
			throw new Error('Page not found, error 3');
		}

		if (askedChapter === undefined) {
			return {
				itemType: 'chapter',
				data: filtered,
				selectedIndex: askedTypeId
			};
		}

		// FILTER CHAPTERS
		filtered = filtered.allItems.filter(function (chapter) {
			return chapter.id === askedChapter;
		});

		if (filtered.length === 1) {
			filtered = filtered[0];
		} else {
			throw new Error('Page not found, error 4');
		}

		// Check if chapter exist for asked type
		if (filtered.hasType(askedTypeId) !== true) {
			throw new Error('Page not found, error 5');
		}

		return {
			itemType: 'details',
			data: filtered,
			selectedIndex: askedTypeId
		};
	}

};
exports.appViewModel = appViewModel;