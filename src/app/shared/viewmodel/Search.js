'use strict';

import {inspect} from './../utils/debug';
import {appViewModel} from './../viewmodel/RekAppViewModel';

const utils = require('./../utils/utils');
const lunr = require('lunr');

let SEARCHINDEX;
const TABTYPES = ['drugs', 'advice'];

const search = {
	addToIndex(list) {

		SEARCHINDEX = lunr(function () {
			this.field('chapter', { boost: 20 });
			this.field('section', { boost: 10 });
			this.field('body');
			this.ref('id');
		});

		list.allItems.forEach(section => {
			section.allItems.forEach(chapter => {
				TABTYPES.forEach(tabType => {
					let curContent = chapter.getContent(tabType);
					if (curContent !== undefined) {
						curContent = stripHTML(curContent);
						SEARCHINDEX.add({
							id: tabType + '/' + section.id + '/' + chapter.id,
							chapter: chapter.title,
							section: section.title,
							body: curContent
						});

					}
				});
			});

		});
	},
	
	search(searchStr) {
		return new Promise(function (resolve/*, reject*/) {
			let ret = SEARCHINDEX.search(searchStr).map(ref => {
				let id = utils.internalUrlToArray(ref.ref);
				let section = appViewModel.getSpecific([id[0], id[1]]);
				let chapter = appViewModel.getSpecific(id);
				return {
					section: section.data.title,
					chapter: chapter.data.title,
					tabIndex: chapter.selectedIndex,
					url: ref.ref
				};
			});
			resolve(ret);
		});
	}
};

function stripHTML(str) {
	return str.replace(/(<([^>]+)>)/ig, '');
}

export default search;
