'use strict';

//import {inspect} from './../utils/debug';

let MAIN_DATA_LIST;

const TABTYPES = ['drugs', 'advice'];

export const appViewModel = {

	setMainDataList(mainDataList) {
		MAIN_DATA_LIST = mainDataList;
	},

	getMainDataList() {
		return MAIN_DATA_LIST;
	},

	getSpecific(slugs) {

		let askedTypeNameOrId = slugs[0];
		let askedSection = slugs[1];
		let askedChapter = slugs[2];

		// Get type ID
		let askedTypeId;
		if (typeof askedTypeNameOrId === 'number') {
			askedTypeId = askedTypeNameOrId;
		} else {
			askedTypeId = TABTYPES.indexOf(askedTypeNameOrId);
		}


		// FILTER SECTIONS
		let filtered = MAIN_DATA_LIST.allItems.filter(section => section.id === askedSection);

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
		filtered = filtered.allItems.filter(chapter => (chapter.id === askedChapter));

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
