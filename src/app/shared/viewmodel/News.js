'use strict';

import {ObservableArray} from 'data/observable-array';
import {inspect} from './../utils/debug';
import DataLoader from './../utils/DataLoader';


let NEWS_LIST = new ObservableArray([]);

const News = {
	sort() {
		NEWS_LIST = NEWS_LIST.sort(function (a, b) {
			if (a.date > b.date) {
				return 1;
			}
			if (a.date < b.date) {
				return -1;
			}
			return 0;
		});
	},

	addAll(list) {
		while(NEWS_LIST.length > 0) {
			NEWS_LIST.pop();
		}

		let added = 0;
		list.forEach(article => {
			if (typeof article !== 'undefined') {

				NEWS_LIST.push(article);
			}
		});

		News.sort();

		return NEWS_LIST;
	},

	get() {
		return NEWS_LIST;

		//return new Promise((resolve/*, reject*/) => {
		//	if (NEWS_LIST.length > 0) {
		//		resolve(NEWS_LIST);
		//	} else {
		//		resolve(DataLoader.loadNews([global.REK.news]));
		//	}
		//});
	},


	loadIfNeeded() {
		if (NEWS_LIST.length < 1) {
			DataLoader.loadNews([global.REK.news]);
		}

	}
};

export default News;
