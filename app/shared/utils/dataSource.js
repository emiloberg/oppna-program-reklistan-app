'use strict';





var debug = require('./debug');
var utils = require('./utils');

var RESOURCE_URLS = {
		drugs: {
			url: 'http://local.dev:8080/api/jsonws/skinny-web.skinny/get-skinny-journal-articles/company-id/10155/group-name/Guest/ddm-structure-id/11571/locale/sv_SE',
			isJson: true
		},
		advice: {
			url: 'http://local.dev:8080/api/jsonws/skinny-web.skinny/get-skinny-journal-articles/company-id/10155/group-name/Guest/ddm-structure-id/12602/locale/sv_SE',
			isJson: true
		},
		hbsDrugs: {
			url: 'http://local.dev:8080/reklistan-theme/handlebars/details-drugs.hbs'
		}
};

function get() {
	var rekData; // todo read from file

	if (!rekData) {
		fetchFromServer();
	}
}

function fetchFromServer() {
	var http = require('http');

	Promise.all(
		Object.keys(RESOURCE_URLS).map(function(name) {
			return http.request({ url: RESOURCE_URLS[name].url, method: 'GET' })
			.then(function(response) {

				if (response.statusCode < 200 || response.statusCode >= 300) {
					throw new Error('Could not load resource ' + name);
				}

				var resData;
				if (RESOURCE_URLS[name].isJson) {
					resData = response.content.toJSON();
				} else {
					resData = response.content.toString();
				}

				return {
					name: name,
					data: resData
				};
			});
	}))
	.catch(function (e) {
		console.log('CATCHING');
		console.log(e);
	})
	.then(function(e) {

			var data = {
				drugs: {},
				advice: {},
				hbsDrugs: ''
			};
			e.forEach(function (response) {
				data[response.name] = response.data;
			});

			return convertREKJsonToModelObj(data);



	});

}

/**
 * @param {object} data
 * @param {object} data.drugs
 * @param {object} data.advice
 * @param {string} data.hbsDrugs
 */
function convertREKJsonToModelObj(data) {

	var dataOut = {
		hbs: {},
		meta: {},
		entries: []
	};

	['drugs', 'advice'].forEach(function (type) {
		var chapterIndex = 0;
		var detailsIndex = 0;

		data[type].forEach(function (chapter) {
			var curChapterIndex = dataOut.entries.indexOf(chapter.title);
			if(curChapterIndex === -1) {
				chapterIndex = dataOut.entries.length;
				dataOut.entries.push({
					name: chapter.title,
					chapters: []
				});
			} else {
				chapterIndex = curChapterIndex;
			}

			chapter.fields.forEach(function(details) {

				var curDetailsIndex = dataOut.entries[chapterIndex].chapters.indexOf(details.value);

				if(curChapterIndex === -1) {
					detailsIndex = dataOut.entries[chapterIndex].chapters.length;
					var saveObj = {
						name: details.value,
						id: utils.makeUrlSafe(chapter.title) + '/' + utils.makeUrlSafe(details.value)
					};
					dataOut.entries[chapterIndex].chapters.push(saveObj);
				} else {
					detailsIndex = curDetailsIndex;
				}

				if (type === 'drugs') {
					dataOut.entries[chapterIndex].chapters[detailsIndex].drugs = true;
				} else if (type === 'advice') {
					dataOut.entries[chapterIndex].chapters[detailsIndex].advice = true;
				}

			});
		});

	});


	debug.inspect(dataOut.entries);

}




//data = {
//	hbs: {
//		details: '<html>...'
//		drugs: '<html>...'
//		advice: '<html>...'
//	},
//	meta: {}
//	entries: [
//		{
//			name: 'Diabetes',
//			chapters: [
//				{
//					name: 'Insuliner',
//					id: 'diabetes/insuliner',
//					drugs: true
//				},
//				{
//					name: 'Riktvärden och omvandlingstabell',
//					id: 'diabetes/rikt..',
//					advice: true
//				},
//				{
//					name: 'Obesitas',
//					id: 'diabetes/obesitas',
//					advice: true,
//					drugs: true
//				},
//			]
//		}
//	]
//}



module.exports.get = get;
