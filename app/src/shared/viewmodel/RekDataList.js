'use strict';

import {Observable} from 'data/observable';

export default class RekDataList extends Observable {

	constructor(title, items, sort) {
		super();
		this._title = title;
		this._selectedIndex = 0;
		this._allItems = items;
		this._sort = sort === true;
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
		let filteredItems = this._allItems.filter(item =>
			item.hasType(this._selectedIndex));
		if (this._sort) {
			filteredItems = filteredItems.sort((o1, o2) => 
				o1.getOrder(this._selectedIndex) - o2.getOrder(this._selectedIndex));
		}
		return filteredItems;
	}

	hasType(type) {
		return this._allItems.some(item => item.hasType(type));
	}
}
