'use strict';

import {Observable} from 'data/observable';
import language from './../utils/language';
import {debug} from './../utils/debug';
import AppMessage from './AppMessage';
import {getNumber as settingsGetNumber, setNumber as settingsSetNumber} from 'application-settings';

const moment = require('moment');
moment.locale('sv');

let METADATA_OBJ = new Observable({
	dataUpdated: 0,
	dataUpdatedStr: language.lastUpdated + 'är okänt',
	dataUpdatedFriendly: 'not set'
});

const Metadata = {
	setDataUpdated(now, sendMessage = true) {
		const friendly = moment(now).fromNow();
		debug('Setting last updated data to ' + now);
		METADATA_OBJ.set('dataUpdated', now);
		METADATA_OBJ.set('dataUpdatedStr', language.lastUpdated + friendly);
		METADATA_OBJ.set('dataUpdatedFriendly', friendly);
		settingsSetNumber('dataLastUpdated', now);

		if (sendMessage === true) {
			AppMessage.setMessage('Datan är uppdaterad', 'info');
		}
	},

	setDataUpdatedNow() {
		Metadata.setDataUpdated(new Date().getTime());
	},

	get() {
		return METADATA_OBJ;
	},

	getFriendlyDataUpdated() {
		return METADATA_OBJ.get('dataUpdatedFriendly');
	},

	getDataUpdated() {
		return METADATA_OBJ.get('dataUpdated');
	}

};

Metadata.setDataUpdated(settingsGetNumber('dataLastUpdated', 0), false);

export default Metadata;
