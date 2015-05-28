'use strict';

var application = require('application');
application.mainModule = 'views/main-page';
application.cssFile = './app.css';

application.onUncaughtError = function (error) {
    console.log("Application error: " + error.name + "; " + error.message + "; " + error.nativeError);
};

application.start();
