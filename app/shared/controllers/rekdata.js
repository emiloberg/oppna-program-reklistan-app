var deb = require('./../utils/debug');
var MainMenu = require("./../models/MainMenu");

function getJSONData(){
	var http = require("http");
	http.getJSON("http://local.dev:8080/api/jsonws/skinny-web.skinny/get-skinny-journal-articles/company-id/10155/group-name/Guest/ddm-structure-id/11571/locale/sv_SE").then(function (r) {
		
		console.log('Downloaded JSON data');
		var menuData = getMenu(r);
		console.log(JSON.stringify(menuData));

		MainMenu.set(menuData);
		
	}, function (e) {
		console.log('ERROR');
		console.log(e);
		done(e);
	});
}

function getMenu(data) {
	return data.map(function (entry) {
		return {name: entry.title};
	});
}

module.exports.getJSONData = getJSONData;


