'use strict';

import {Observable} from 'data/observable';
import {ObservableArray} from 'data/observable-array';
import {inspect} from './../utils/debug';
import DataLoader from './../utils/DataLoader';


let NEWS_LIST = new ObservableArray([]);
let NEWS_OBJ = new Observable({
	items: NEWS_LIST,
	count: 0
});

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
		list.every(article => {
			if (typeof article !== 'undefined') {
				if (added >= global.REK.preferences.maxNews) {
					inspect('Breaking because ' + added + ' is equal or larger than ' + global.REK.preferences.maxNews );
					return false;
				}
				NEWS_LIST.push(article);
				added += 1;
			}
			return true;
		});

		News.sort();

		NEWS_OBJ.set('count', NEWS_LIST.length);

		return NEWS_LIST;
	},

	get() {
		return NEWS_OBJ;
	},

	getNewsCount() {
		return NEWS_LIST.length
	},


	loadIfNeeded() {
		if (NEWS_LIST.length < 1) {
			DataLoader.loadNews([global.REK.news]);
		}

	}
};

export default News;
