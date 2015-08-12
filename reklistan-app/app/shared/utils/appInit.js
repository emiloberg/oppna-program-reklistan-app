'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _DataLoader = require('./DataLoader');

var _DataLoader2 = _interopRequireDefault(_DataLoader);

var _viewmodelRekAppViewModel = require('../viewmodel/RekAppViewModel');

var _viewmodelSearch = require('../viewmodel/Search');

var _viewmodelSearch2 = _interopRequireDefault(_viewmodelSearch);

var _debug = require('./debug');

//
//import fs from 'file-system';
//const DOCUMENTS_FOLDER = fs.knownFolders.documents();

//var file = documents.getFile("NewFileToCreate.txt");

function init() {

	var forceDownload = false;

	(0, _debug.debug)('INITIALIZING APP');

	var sourceSpec = {
		json: [{
			name: 'drugs',
			localFileName: 'drugs.json',
			url: global.REK.urls.drugs,
			download: forceDownload
		}, {
			name: 'advice',
			localFileName: 'advice.json',
			url: global.REK.urls.advice,
			download: forceDownload
		}],

		templates: [{
			name: 'drugs',
			localFileName: 'details-drugs.hbs',
			url: global.REK.urls.hbsDrugs,
			download: forceDownload
		}, {
			name: 'advice',
			localFileName: 'details-advice.hbs',
			url: global.REK.urls.hbsAdvice,
			download: forceDownload
		}],

		css: [{
			name: 'custom',
			localFileName: 'custom.css',
			url: global.REK.urls.css,
			download: forceDownload
		}]
	};

	return _DataLoader2['default'].loadViewModel(sourceSpec).then(function (list) {
		_viewmodelRekAppViewModel.appViewModel.setMainDataList(list);
		_viewmodelSearch2['default'].addToIndex(list);
	});
	//.catch(err => {
	//	console.log(err);
	//	console.log('FEL I INIT()');
	//});
}

module.exports.init = init;