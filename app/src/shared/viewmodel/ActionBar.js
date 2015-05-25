'use strict';
import Images from './../utils/images';

import {Observable} from 'data/observable';

const TABTYPES = ['_drugsSelected', '_adviceSelected'];

export default class ActionBar extends Observable {

	constructor(pageTitle, backTitle, selectedIndex) {
		super();
		this._iconBack = Images.left;
		this._iconSearch = Images.search;
		this._iconMenu = Images.menu;
		this._pageTitle = pageTitle;
		this._backTitle = backTitle;
		this._drugsSelected = (selectedIndex === 0);
		this._adviceSelected = (selectedIndex === 1);
	}

	set selectedIndex(index) {
		this[TABTYPES[index]] = true;
		this[TABTYPES[(index === 0) ? 1 : 0]] = false;

		this.notify({
			object: this,
			eventName: 'propertyChange',
			propertyName: TABTYPES[index],
			value: true
		});

		this.notify({
			object: this,
			eventName: 'propertyChange',
			propertyName: TABTYPES[(index === 0) ? 1 : 0],
			value: false
		});
	}

	get iconBack() { return this._iconBack; }
	get iconSearch() { return this._iconSearch; }
	get iconMenu() { return this._iconMenu; }
	get pageTitle() { return this._pageTitle; }
	get backTitle() { return this._backTitle; }
	get drugsSelected() { return this._drugsSelected; }
	get adviceSelected() { return this._adviceSelected; }



}

function otherTab(index) {
	return ;
}
