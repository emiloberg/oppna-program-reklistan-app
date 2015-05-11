'use strict';





let debug = require('./debug');
let utils = require('./utils');
let RekData = require('./../models/RekData');

const RESOURCE_URLS = {
		drugs: {
			url: 'http://local.dev:8080/api/jsonws/skinny-web.skinny/get-skinny-journal-articles/company-id/10155/group-name/Guest/ddm-structure-id/11571/locale/sv_SE',
			//url: 'http://localhost:5656/drugs.json',
			isJson: true
		},
		advice: {
			url: 'http://local.dev:8080/api/jsonws/skinny-web.skinny/get-skinny-journal-articles/company-id/10155/group-name/Guest/ddm-structure-id/12602/locale/sv_SE',
			//url: 'http://localhost:5656/advice.json',
			isJson: true
		},
		hbsDrugs: {
			url: 'http://local.dev:8080/reklistan-theme/handlebars/details-drugs.hbs'
			//url: 'http://localhost:5656/details-drugs.hbs',
		}
};

function get() {
	let rekData;

	//TODO Read from file here

	if (!rekData) {
		fetchDataFromServer();
	}
}

function fetchDataFromServer() {
	let http = require('http');

	Promise.all(
		Object.keys(RESOURCE_URLS).map(function(name) {
			return http.request({ url: RESOURCE_URLS[name].url, method: 'GET' })
			.then(function(response) {

				if (response.statusCode < 200 || response.statusCode >= 300) {
					return new Error('Could not load resource ' + name);
				}

				let resData;
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
		})
	)
	.then(function(e) {

		// Convert response array to object
		let data = {
			drugs: {},
			advice: {},
			hbsDrugs: ''
		};
		e.forEach(function (response) {
			data[response.name] = response.data;
		});

		RekData.set(convertREKJsonToModelObj(data));

		debug.inspect(RekData.get());

	})
	.catch(function (e) {
		console.log('CATCHING');
		//console.log(e);
		console.error(e);
		console.error(e.stack);
	});
}

/**
 * Takes Skinny JSON Response JSON and Convert to data model object.
 *
 * @param {object} data
 * @param {object} data.drugs
 * @param {object} data.advice
 */
function convertREKJsonToModelObj(data) {
	let dataOut = [];
	['drugs', 'advice'].forEach(function (type) {
		let chapterIndex = 0;
		let detailsIndex = 0;
		data[type].forEach(function (chapter) {

			// Add chapter or get array index of chapter if chapter already exists
			let curChapterIndex = dataOut.map(e => e.name).indexOf(chapter.title);
			if(curChapterIndex === -1) {
				dataOut.push({
					name: chapter.title,
					chapters: []
				});
				chapterIndex = dataOut.length - 1;
			} else {
				chapterIndex = curChapterIndex;
			}

			chapter.fields.forEach(function(details) {
				// Add details or get array index of details if details already exists
				let curDetailsIndex = dataOut[chapterIndex].chapters.map(e => e.name).indexOf(details.value);
				if(curDetailsIndex === -1) {
					dataOut[chapterIndex].chapters.push({
						name: details.value,
						id: utils.makeUrlSafe(chapter.title) + '/' + utils.makeUrlSafe(details.value)
					});
					detailsIndex = dataOut[chapterIndex].chapters.length - 1;
				} else {
					detailsIndex = curDetailsIndex;
				}

				// Add drug/advice to indicate details have drug/advice information.
				if (type === 'drugs') {
					dataOut[chapterIndex].chapters[detailsIndex].drugs = true;
				} else if (type === 'advice') {
					dataOut[chapterIndex].chapters[detailsIndex].advice = true;
				}
			});
		});
	});
	return dataOut;
}

module.exports.get = get;
