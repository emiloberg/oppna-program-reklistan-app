'use strict';

import Images from './../utils/images';

export default class SearchResultItem {

	constructor(chapter, section, url, type) {
		this._chapter = chapter;
		this._section = section;
		this._url = url;
		this._type = type;
	}

	get icon() {
		if (this._type === 1) {
			return Images.advice;
		} else {
			return undefined;
		}
	}

	get chapter() { return this._chapter; }
	get section() { return this._section; }
	get url() { return this._url; }
}
