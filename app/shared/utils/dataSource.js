'use strict';

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
			console.log('>>> ' + name );
			console.log(RESOURCE_URLS[name].url);
			return http.request({ url: RESOURCE_URLS[name].url, method: 'GET' })
			.then(function(response) {

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
			console.log('-------');

			e.forEach(function (apa) {
				console.log(apa.data);
			});

	});

}



module.exports.get = get;