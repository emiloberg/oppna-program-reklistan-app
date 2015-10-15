'use strict';
import {screen} from 'platform';
import {ios} from 'application';

const screenDimensions = {
	width: screen.mainScreen.widthDIPs,
	height: ios ? screen.mainScreen.heightDIPs - 20 : screen.mainScreen.heightDIPs
	// TODO: Change this -20 magic to include the iOS battery/wifi/etc bar once NativeScript releases it's new version with FrameModule.measure()
};

export default screenDimensions;
