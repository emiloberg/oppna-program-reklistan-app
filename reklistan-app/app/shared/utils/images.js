'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _imageSource = require('image-source');

var _platform = require('platform');

var _application = require('application');

//import {inspect} from './debug';

var scaleFactor = _platform.screen.mainScreen.scale;

function getImage(category, name) {
	var scalePath = undefined;
	var imagePath = undefined;
	if (_application.ios) {
		imagePath = '~/images/' + category + '/ios/' + name;
		if (scaleFactor >= 3) {
			scalePath = '@3x';
		} else if (scaleFactor >= 2) {
			scalePath = '@2x';
		}
		imagePath = imagePath + scalePath + '.png';
	} else if (_application.android) {
		imagePath = '~/images/' + category + '/android/';

		if (scaleFactor >= 4) {
			scalePath = 'drawable-xxxhdpi';
		} else if (scaleFactor >= 3) {
			scalePath = 'drawable-xxhdpi';
		} else if (scaleFactor >= 2) {
			scalePath = 'drawable-xhdpi';
		} else if (scaleFactor >= 1.5) {
			scalePath = 'drawable-hdpi';
		} else {
			scalePath = 'drawable-mdpi';
		}
		imagePath = imagePath + scalePath + '/' + name + '.png';
	}
	return (0, _imageSource.fromFile)(imagePath);
}

var Images = {
	left: getImage('navigation', 'ic_chevron_left'),
	menu: getImage('navigation', 'ic_menu'),
	close: getImage('navigation', 'ic_close'),
	search: getImage('action', 'ic_search'),
	advice: getImage('custom', 'advice')
};

exports['default'] = Images;
module.exports = exports['default'];