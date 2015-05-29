import {fromFile as imageFromFile} from 'image-source';
import {screen} from 'platform';
import {android, ios} from 'application';
//import {inspect} from './debug';

const scaleFactor = screen.mainScreen.scale;

function getImage(category, name) {
	let scalePath;
	let imagePath;
	if (ios) {
		imagePath = '~/images/' + category + '/ios/' + name;
		if (scaleFactor >= 3) {
			scalePath = '@3x';
		} else if (scaleFactor >= 2) {
			scalePath = '@2x';
		}
		imagePath = imagePath + scalePath + '.png';
	} else if (android) {
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
	return imageFromFile(imagePath);
}

const Images = {
	left: getImage('navigation', 'ic_chevron_left'),
	menu: getImage('navigation', 'ic_menu'),
	close: getImage('navigation', 'ic_close'),
	search: getImage('action', 'ic_search')
};

export default Images;
