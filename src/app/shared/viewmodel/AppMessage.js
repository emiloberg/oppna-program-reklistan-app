'use strict';

import {screen} from 'platform';
import {Observable} from 'data/observable';
import language from './../utils/language';
import {AbsoluteLayout} from 'ui/layouts/absolute-layout';
import {inspect} from './../utils/debug';
import navigation from './../utils/navigation';
import Metadata from './Metadata';
import Mainmenu from './Mainmenu';

const deviceWidth = screen.mainScreen.widthPixels / screen.mainScreen.scale;
const deviceHeight = screen.mainScreen.heightPixels / screen.mainScreen.scale;

let APP_MESSAGE = new Observable({
	message: '',
	type: '',
	messageDownloadDataUpdateNow: language.messageDownloadDataUpdateNow,
	messageDownloadDataUpdateLater: language.messageDownloadDataUpdateLater,
	hideMessageTap: function() {
		AppMessage.removeMessages();
	},
	downloadDataTap: function() {
		AppMessage.removeMessages();
		navigation.toReloadData();
	}
});

let timeoutId;

const AppMessage = {
	setup(elAppMessage) {

		// Set to float on bottom
		// iOS appbar is not included when we get deviceHeight, therefor we need include it.
		let potentialIOSBar = elAppMessage.ios ? 20 : 0;
		AbsoluteLayout.setTop(elAppMessage, deviceHeight - elAppMessage.height - potentialIOSBar);

		// Set width to 100 %
		elAppMessage.width = deviceWidth;

		// Set "Update your data now message" if it's old.
		// TODO: Om användaren klickat "senare" så måste vi vänta ett tag innan vi frågar hen igen.
		if(((new Date().getTime() - Metadata.getDataUpdated()) / 1000 ) > global.REK.preferences.warnOldData) {
			AppMessage.setUpdateDataMessage();
		}


		return APP_MESSAGE;
	},

	get() {
		return APP_MESSAGE;
	},

	setMessage(message, type = 'info') {
		clearTimeout(timeoutId);

		APP_MESSAGE.set('type', type);
		APP_MESSAGE.set('message', message);


		if (type === 'info') {
			timeoutId = setTimeout(AppMessage.removeMessages, 3000)
		}
	},


	setUpdateDataMessage() {
		AppMessage.setMessage(language.messageDownloadDataMessage + Metadata.getFriendlyDataUpdated() + '.', 'updateData');
	},


	removeMessages() {
		clearTimeout(timeoutId);
		Mainmenu.hide();
		APP_MESSAGE.set('type', '');
		APP_MESSAGE.set('message', '');
	}
};

export default AppMessage;
