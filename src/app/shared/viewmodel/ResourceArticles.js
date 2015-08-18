'use strict';

import {inspect} from './../utils/debug';

let RESOURCE_ARTICLES = [];

const ResourceArticles = {
	sort() {
		RESOURCE_ARTICLES = RESOURCE_ARTICLES.sort(function (a, b) {
			if (a.sortOrder > b.sortOrder) {
				return 1;
			}
			if (a.sortOrder < b.sortOrder) {
				return -1;
			}
			return 0;
		});
	},

	addAll(list) {

		while(RESOURCE_ARTICLES.length > 0) {
			RESOURCE_ARTICLES.pop();
		}

		list.forEach(article => {
			RESOURCE_ARTICLES.push(article);
		});

		ResourceArticles.sort();
	},

	get() {
		return RESOURCE_ARTICLES;
	}
};

export default ResourceArticles;
