'use strict';
var application = require('application');

var debug = require('./shared/utils/debug');

application.mainModule = 'views/main-page';
application.cssFile = './app.css';

application.onUncaughtError = function (error) {
    debug.debug('Application error: ' + error.name + '; ' + error.message + '; ' + error.nativeError);
};

const _host = 'http://local.dev:8080';

global.REK = {
	urlDataLocation: _host + '/reklistan-theme/resources/appdata.json',
	preferences: {
		host: _host,
		maxNews: 5,
		warnOldData: 1209600, // Warn about old data when it's x seconds old.
		askLaterGracePeriod: 86400 // When user clicks "download later", how long to ask before next ask.
	}
};


// 1 hour = 3600
// 1 day = 86400
// 1 week = 604 800
// 2 weeks = 1 209 600




debug.debug('#### APP SETTINGS\n' + JSON.stringify(global.REK, null, '  '));

application.start();

