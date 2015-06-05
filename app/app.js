'use strict';

var application = require('application');
application.mainModule = 'views/main-page';
application.cssFile = './app.css';

application.onUncaughtError = function (error) {
    console.log('Application error: ' + error.name + '; ' + error.message + '; ' + error.nativeError);
};

var appSettings = require('application-settings');

// Load files from local file system instead of from the net
appSettings.setBoolean('develLocalFiles', true); // TODO: Change for production

application.start();
