'use strict';


export default class ResourceArticle {

	constructor(uuid, title, body, externalLink, sortOrder) {
		this._uuid = uuid;
		this._title = title;
		this._body = body;
		this._externalLink = externalLink;
		this._sortOrder = sortOrder;
	}

	get uuid() { return this._uuid; }
	get title() { return this._title; }
	get body() { return this._body; }
	get externalLink() { return this._externalLink; }
	get sortOrder() { return this._sortOrder; }
}
