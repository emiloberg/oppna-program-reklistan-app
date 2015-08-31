'use strict';

const TYPENAMES = ['drugs', 'advice'];

export default class ContentItem {
	constructor(title, content, order, id, linkToArticle) {
		this._title = title;
		this._content = content;
		this._order = order;
		this._id = id;
		this._linkToArticle = linkToArticle;
	}

	get title() {
		return this._title;
	}

	get id() {
		return this._id;
	}

	isLinkToArticle(typeNameOrId) {
		let type = typeNameOrId;
		if (typeof typeNameOrId === 'number') {
			type = TYPENAMES[typeNameOrId];
		}

		return this._linkToArticle[type] ? this._content[type] : false;
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
