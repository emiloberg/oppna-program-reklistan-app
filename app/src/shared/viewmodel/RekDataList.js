'use strict';

import {Observable} from 'data/observable';

export default class RekDataList extends Observable {

	constructor(title, items) {
		super();
		this._title = title;
		this._selectedIndex = 0;
		this._allItems = items;
	}

	get selectedIndex() {
		return this._selectedIndex;
	}

	set selectedIndex(index) {
		if (this._selectedIndex !== index) {

			this._selectedIndex = index;

			this.notify({
				object: this,
				eventName: 'propertyChange',
				propertyName: 'selectedIndex',
				value: index
			});

			this.notify({
				object: this,
				eventName: 'propertyChange',
				propertyName: 'items',
				value: this.items
			});
		}
	}

	get title() {
		return this._title;
	}

	get items() {
		return this._allItems.filter(item =>
			item.hasType(this._selectedIndex));
	}

	//get allItems() {
	//	return this.allItems;
	//}

	hasType(type) {
		return this._allItems.some(item => item.hasType(type));
	}
}
