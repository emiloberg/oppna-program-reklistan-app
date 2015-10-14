'use strict';


import {Observable} from 'data/observable';
import language from './../utils/language';
//import {inspect} from './../utils/debug';
import navigation from './../utils/navigation';
import Metadata from './Metadata';
import Mainmenu from './Mainmenu';

let askDataDownloadLaterTimestamp = 0;

let APP_MESSAGE = new Observable({
	message: '',
	type: '',
	messageDownloadDataUpdateNow: language.messageDownloadDataUpdateNow,
	messageDownloadDataUpdateLater: language.messageDownloadDataUpdateLater,
	hideMessageTap: function() {
		AppMessage.downloadDataLater();
	},
	downloadDataTap: function() {
		AppMessage.removeMessages();
		navigation.toReloadData();
	}
});

let timeoutId;

const AppMessage = {
	checkOldData() {
		console.log('Checking old data' + new Date().getTime());
		const now = new Date().getTime();
		if(((now - Metadata.getDataUpdated()) / 1000 ) > global.REK.preferences.warnOldData) {
			if (((now - askDataDownloadLaterTimestamp) / 1000 ) > global.REK.preferences.askLaterGracePeriod) {
				AppMessage.setUpdateDataMessage();
			}
		}
	},

	get() {
		return APP_MESSAGE;
	},

	setMessage(message, type = 'info') {
		clearTimeout(timeoutId);

		APP_MESSAGE.set('type', type);
		APP_MESSAGE.set('message', message);


		if (type === 'info') {
			timeoutId = setTimeout(AppMessage.removeMessages, 3000);
		}
	},


	setUpdateDataMessage() {
		AppMessage.setMessage(language.messageDownloadDataMessage + Metadata.getFriendlyDataUpdated() + '.', 'updateData');
	},


	removeMessages() {
		clearTimeout(timeoutId);
		//Mainmenu.hide();
		APP_MESSAGE.set('type', '');
		APP_MESSAGE.set('message', '');
	},

	downloadDataLater() {
		askDataDownloadLaterTimestamp = new Date().getTime();
		AppMessage.removeMessages();
	}
};

export default AppMessage;
