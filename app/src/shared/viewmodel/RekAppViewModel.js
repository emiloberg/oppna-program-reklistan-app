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

	getSpecific(askedTypeNameOrId, askedSection, askedChapter) {

		return new Promise(function (resolve/*, reject*/) {

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
				resolve({
					itemType: 'chapter',
					data: filtered,
					selectedIndex: askedTypeId
				});
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

			resolve({
				itemType: 'details',
				data: filtered,
				selectedIndex: askedTypeId
			});

		});
	}

};
