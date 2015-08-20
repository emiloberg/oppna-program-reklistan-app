'use strict';

import {Observable} from 'data/observable';
import language from './../utils/language';
import {getNumber as settingsGetNumber, setNumber as settingsSetNumber} from 'application-settings';

const moment = require('moment');
moment.locale('sv');

let METADATA_OBJ = new Observable({
	dataUpdated: 0,
	dataUpdatedStr: language.lastUpdated + 'är okänt'
});

const Metadata = {
	setDataUpdated(now) {
		METADATA_OBJ.set('dataUpdated', now);
		METADATA_OBJ.set('dataUpdatedStr', language.lastUpdated + moment(now).fromNow());
		settingsSetNumber('dataLastUpdated', now);
	},

	setDataUpdatedNow() {
		Metadata.setDataUpdated(new Date().getTime());
	},

	get() {
		return METADATA_OBJ;
	}
};

Metadata.setDataUpdated(settingsGetNumber('dataLastUpdated', 0));

export default Metadata;
