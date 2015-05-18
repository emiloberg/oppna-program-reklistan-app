
const TYPENAMES = ['drugs', 'advice'];

export default class ContentItem {

	constructor(title, content) {
		this._title = title;
		this._content = content;
	}

	get title() {
		return this._title;
	}

	getContent(typeName) {
		return this._content[typeName];
	}

	hasType(typeName) {
		return this._content.hasOwnProperty(TYPENAMES[typeName]);
	}
}