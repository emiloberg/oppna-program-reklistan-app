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
		console.log('APA APA APA');
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

	var entries = {};
	entries = addDataToObj(entries, data.drugs, 'drugs');
	entries = addDataToObj(entries, data.advice , 'advice');

	debug.inspect(entries);
}

function addDataToObj(obj, data, type) {
	data.forEach(function(chapter) {

		if (!obj[chapter.title]) {
			obj[chapter.title] = {
				name: chapter.title,
				chapters: {}
			};
		}

		console.log(chapter.title);
		console.log('---');

		chapter.fields.forEach(function(details) {
			if (!obj[chapter.title].chapters[details.value]) {
				console.log('FINNS INTE: ' + details.value);
				obj[chapter.title].chapters[details.value] = {
					name: details.value,
					id: utils.makeUrlSafe(chapter.title) + '/' + utils.makeUrlSafe(details.value)
				};
			}

			if (type === 'drugs') {
				obj[chapter.title].chapters[details.value].drugs = true;
			} else if (type === 'advice') {
				obj[chapter.title].chapters[details.value].advice = true;
			}


		});

	});

	return obj;
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
