'use strict';
var application = require('application');
var debug = require('./shared/utils/debug');

import AppMessage from './shared/viewmodel/AppMessage';

//application.mainModule = 'views/menu-sections';
application.mainEntry = {
	moduleName: 'views/download-data',
	context: {
		downloadType: 'init'
	},
	backstackVisible: false
	//animated: false
};
application.cssFile = './app.css';

application.onUncaughtError = function (error) {
    debug.debug('Application error: ' + error.name + '; ' + error.message + '; ' + error.nativeError);
};

var _host = 'https://reklistan.vgregion.se'; // NB: No trailing slash

global.REK = {
	urlDataLocation: _host + '/reklistan-theme/resources/appdata.json',
	preferences: {
		host: _host,
		maxNews: 5,
		warnOldData: 1209600, // Warn about old data when it's x seconds old.
		askLaterGracePeriod: 86400, // When user clicks "download later", how long to ask before next ask.
		checkOldDataEvery: 30 // How often to check for old data.
	}
};

debug.debug('#### APP SETTINGS\n' + JSON.stringify(global.REK, null, '  '));

/**
 * Setup check to see if the data is old.
 */
setInterval(function() {
	AppMessage.checkOldData();
}, (global.REK.preferences.checkOldDataEvery * 1000));

application.start();

// TODO: Test Android
// TODO: Check if customUi.setViewDefaults(); is needed everywhere....
