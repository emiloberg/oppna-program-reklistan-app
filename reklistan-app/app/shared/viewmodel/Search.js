'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _utilsDebug = require('./../utils/debug');

var _viewmodelRekAppViewModel = require('./../viewmodel/RekAppViewModel');

var utils = require('./../utils/utils');
var lunr = require('lunr');

var SEARCHINDEX = undefined;
var TABTYPES = ['drugs', 'advice'];

var search = {
	addToIndex: function addToIndex(list) {

		SEARCHINDEX = lunr(function () {
			this.field('chapter', { boost: 20 });
			this.field('section', { boost: 10 });
			this.field('body');
			this.ref('id');
		});

		list.allItems.forEach(function (section) {
			section.allItems.forEach(function (chapter) {
				TABTYPES.forEach(function (tabType) {
					var curContent = chapter.getContent(tabType);
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

	search: function search(searchStr) {
		return new Promise(function (resolve /*, reject*/) {
			var ret = SEARCHINDEX.search(searchStr).map(function (ref) {
				var id = utils.internalUrlToArray(ref.ref);
				var section = _viewmodelRekAppViewModel.appViewModel.getSpecific([id[0], id[1]]);
				var chapter = _viewmodelRekAppViewModel.appViewModel.getSpecific(id);
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

exports['default'] = search;
module.exports = exports['default'];