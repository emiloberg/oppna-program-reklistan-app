let imageSource = require('image-source');
let platform = require('platform');
var app = require('application');

//import {inspect} from './debug';


let scale = platform.screen.mainScreen.scale;
let os;
if (app.android) {
	os = 'android';
} else if (app.ios) {
	os = 'ios';
}

function getImage(category, name) {
	let imagePath = '';
	let scalePath = '';
	if (os === 'ios') {
		imagePath = '~/images/md/' + category + '/ios/' + name + '.imageset/' + name;
		if (scale >= 3) {
			scalePath = '_3x';
		} else if (scale >= 2) {
			scalePath = '_2x';
		}
		imagePath = imagePath + scalePath + '.png';
	} else {
		// todo load android pictures
	}
	//console.log('imagepath ' + imagePath );
	return imageSource.fromFile(imagePath);
}

const Images = {
	left: getImage('navigation', 'ic_chevron_left'),
	menu: getImage('navigation', 'ic_menu'),
	search: getImage('action', 'ic_search')
};

export default Images;
