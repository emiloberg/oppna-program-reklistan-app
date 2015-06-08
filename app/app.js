'use strict';
var debug = require('./shared/utils/debug');

var application = require('application');
application.mainModule = 'views/main-page';
application.cssFile = './app.css';

application.onUncaughtError = function (error) {
    console.log('Application error: ' + error.name + '; ' + error.message + '; ' + error.nativeError);
};

var appSettings = require('application-settings');

// Load files from local file system instead of from the net
appSettings.setBoolean('develLocalFiles', false); // TODO: Change for production


var _properties = {
	host: 'http://local.dev:8080',
	companyId: 10155,
	groupName: 'Guest',
	drugsStructureId: 11571,
	adviceStructureId: 12602,
	resourcesStructureId: 14304,
	locale: 'sv_SE'
};

global.REK = {
	urls: {
		drugs: _properties.host + '/api/jsonws/skinny-web.skinny/get-skinny-journal-articles/' +
		'company-id/' + _properties.companyId +
		'/group-name/' + _properties.groupName +
		'/ddm-structure-id/' + _properties.drugsStructureId +
		'/locale/' + _properties.locale,

		advice: _properties.host + '/api/jsonws/skinny-web.skinny/get-skinny-journal-articles/' +
		'company-id/' + _properties.companyId +
		'/group-name/' + _properties.groupName +
		'/ddm-structure-id/' + _properties.adviceStructureId +
		'/locale/' + _properties.locale,

		resources: _properties.host + '/api/jsonws/skinny-web.skinny/get-skinny-journal-articles/' +
		'company-id/' + _properties.companyId +
		'/group-name/' + _properties.groupName +
		'/ddm-structure-id/' + _properties.resourcesStructureId +
		'/locale/' + _properties.locale,

		hbsDrugs: _properties.host + '/reklistan-theme/handlebars/details-drugs.hbs',
		hbsAdvice: _properties.host + '/reklistan-theme/handlebars/details-advice.hbs',
		hbsResources: _properties.host + '/reklistan-theme/handlebars/resources.hbs',

		css: _properties.host + '/reklistan-theme/css/custom.css?browserId=other&themeId=reklistantheme_WAR_reklistantheme&languageId=en_US&b=6210'
	}
};


application.start();
