'use strict';
import Images from './../utils/images';

import {Observable} from 'data/observable';

export default class ActionBar extends Observable {

	constructor(pageTitle, backTitle, selectedIndex) {
		super();
		this._iconBack = Images.left;
		this._iconSearch = Images.search;
		this._iconMenu = Images.menu;
		this._pageTitle = pageTitle;
		this._backTitle = backTitle;
		this._selectedIndex = selectedIndex;
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
		}
	}

	get iconBack() { return this._iconBack; }
	get iconSearch() { return this._iconSearch; }
	get iconMenu() { return this._iconMenu; }
	get pageTitle() { return this._pageTitle; }
	get backTitle() { return this._backTitle; }
	get selectedIndex() { return this._selectedIndex; }
}
