'use strict';

const TYPENAMES = ['drugs', 'advice'];

export default class ContentItem {

	constructor(title, content, order) {
		this._title = title;
		this._content = content;
		this._order = order;
	}

	get title() {
		return this._title;
	}

	getContent(typeNameOrId) {
		if (typeof typeNameOrId === 'number') {
			return this._content[TYPENAMES[typeNameOrId]];
		} else {
			return this._content[typeNameOrId];
		}
	}

	getOrder(typeNameOrId) {
		if (typeof typeNameOrId === 'number') {
			return this._order[TYPENAMES[typeNameOrId]];
		} else {
			return this._order[typeNameOrId];
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
