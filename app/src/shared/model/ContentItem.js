'use strict';

const TYPENAMES = ['drugs', 'advice'];

export default class ContentItem {

	constructor(title, content) {
		this._title = title;
		this._content = content;
	}

	get title() {
		return this._title;
	}

	getContent(typeNameOrId) {
		if (typeof typeNameOrId === 'number') {
			return this._content[TYPENAMES[typeNameOrId]]
		} else {
			return this._content[typeNameOrId];
		}
	}

	hasType(typeNameOrId) {
		if (typeof typeNameOrId === 'number') {
			return this._content.hasOwnProperty(TYPENAMES[typeNameOrId]);
		} else {
			return this._content.hasOwnProperty(typeNameOrId);
		}
	}
}
