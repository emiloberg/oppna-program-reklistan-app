import {fromFile as imageFromFile} from 'image-source';
import {screen} from 'platform';
import {android, ios} from 'application';
//import {inspect} from './debug';

const scale = platform.screen.mainScreen.scale;
let os;
if (app.android) {
	os = 'android';
} else if (app.ios) {
	os = 'ios';
}


function getImage(category, name) {
	let scalePath;
	let imagePath;
	if (ios) {
		imagePath = '~/images/md/' + category + '/ios/' + name + '.imageset/' + name;
		if (scaleFactor >= 3) {
			scalePath = '_3x';
		} else if (scaleFactor >= 2) {
			scalePath = '_2x';
		}
		imagePath = imagePath + scalePath + '.png';
	} else if (android) {
		// todo load for android
//		imagePath = '~/images/md/' + category + '/ios/' + name + '.imageset/' + name;
	}
	return imageFromFile(imagePath);
}

const Images = {
	left: getImage('navigation', 'ic_chevron_left'),
	menu: getImage('navigation', 'ic_menu'),
	search: getImage('action', 'ic_search')
};

export default Images;
