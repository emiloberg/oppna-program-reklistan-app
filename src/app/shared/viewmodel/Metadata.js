'use strict';

import {Observable} from 'data/observable';
import language from './../utils/language';
import {debug} from './../utils/debug';
import AppMessage from './AppMessage';
import {getNumber as settingsGetNumber, setNumber as settingsSetNumber} from 'application-settings';

let moment = require('moment');

moment.locale('sv', {
	months : 'januari_februari_mars_april_maj_juni_juli_augusti_september_oktober_november_december'.split('_'),
	monthsShort : 'jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec'.split('_'),
	weekdays : 'söndag_måndag_tisdag_onsdag_torsdag_fredag_lördag'.split('_'),
	weekdaysShort : 'sön_mån_tis_ons_tor_fre_lör'.split('_'),
	weekdaysMin : 'sö_må_ti_on_to_fr_lö'.split('_'),
	longDateFormat : {
		LT : 'HH:mm',
		LTS : 'HH:mm:ss',
		L : 'YYYY-MM-DD',
		LL : 'D MMMM YYYY',
		LLL : 'D MMMM YYYY HH:mm',
		LLLL : 'dddd D MMMM YYYY HH:mm'
	},
	calendar : {
		sameDay: '[Idag] LT',
		nextDay: '[Imorgon] LT',
		lastDay: '[Igår] LT',
		nextWeek: '[På] dddd LT',
		lastWeek: '[I] dddd[s] LT',
		sameElse: 'L'
	},
	relativeTime : {
		future : 'om %s',
		past : 'för %s sedan',
		s : 'några sekunder',
		m : 'en minut',
		mm : '%d minuter',
		h : 'en timme',
		hh : '%d timmar',
		d : 'en dag',
		dd : '%d dagar',
		M : 'en månad',
		MM : '%d månader',
		y : 'ett år',
		yy : '%d år'
	},
	ordinalParse: /\d{1,2}(e|a)/,
	ordinal : function (number) {
		var b = number % 10,
			output = (~~(number % 100 / 10) === 1) ? 'e' :
				(b === 1) ? 'a' :
					(b === 2) ? 'a' :
						(b === 3) ? 'e' : 'e';
		return number + output;
	},
	week : {
		dow : 1, // Monday is the first day of the week.
		doy : 4  // The week that contains Jan 4th is the first week of the year.
	}
});


let METADATA_OBJ = new Observable({
	dataUpdated: 0,
	dataUpdatedStr: language.lastUpdated + 'är okänt',
	dataUpdatedFriendly: 'not set'
});

const Metadata = {
	setDataUpdated(now, sendMessage = true) {
		let friendly;
		if (now === 0) {
			friendly = 'not set';
		} else {
			friendly = moment(now).fromNow();
		}
		debug('Setting last updated data to ' + now);
		METADATA_OBJ.set('dataUpdated', now);
		METADATA_OBJ.set('dataUpdatedStr', language.lastUpdated + friendly);
		METADATA_OBJ.set('dataUpdatedFriendly', friendly);
		settingsSetNumber('dataLastUpdated', now);

		if (sendMessage === true) {
			AppMessage.setMessage(language.dataIsUpdated, 'info');
		}
	},

	removeDataUpdated() {
		Metadata.setDataUpdated(0, false);
	},

	setDataUpdatedNow() {
		Metadata.setDataUpdated(new Date().getTime());
	},

	getMetadata() {
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
