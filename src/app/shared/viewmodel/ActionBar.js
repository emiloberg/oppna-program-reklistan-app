'use strict';
import Images from './../utils/images';
import language from './../utils/language';
import {Observable} from 'data/observable';
//import {inspect} from './../utils/debug';

let lastPageTitle = '';
let lastSetSelectedIndex = 0;

export function getLastPageTitle() {
	return lastPageTitle;
}

export default class ActionBar extends Observable {
	
	constructor({
		pageTitle = '',
		backTitle = '',
		enabledTabs = 'both',
		barType = 'normal',
		useLastPageTitle = false,
		showSearchButton = true,
		selectedIndex = lastSetSelectedIndex
	}) {
		if(selectedIndex === undefined) {
			selectedIndex = lastSetSelectedIndex;
		}

		super();
		this._iconBack = Images.left;
		this._iconSearch = showSearchButton ? Images.search : null;
		this._iconMenu = Images.menu;
		this._pageTitle = pageTitle;
		this._backTitle = useLastPageTitle ? lastPageTitle : backTitle;
		this._selectedIndex = selectedIndex;
		this._enabledTabs = enabledTabs;
		this._txtDrugs = language.drugs;
		this._txtAdvice = language.advice;

		if (barType === 'normal') {
			this._iconClose = Images.close;
		}

		lastPageTitle = pageTitle;
	}

	set selectedIndex(index) {
		if (this._selectedIndex !== index) {
			lastSetSelectedIndex = index;
			this._selectedIndex = index;
			this.notify({
				object: this,
				eventName: 'propertyChange',
				propertyName: 'selectedIndex',
				value: index
			});
		}
	}

	get iconClose() { return this._iconClose; }
	get iconBack() { return this._iconBack; }
	get iconSearch() { return this._iconSearch; }
	get iconMenu() { return this._iconMenu; }
	get pageTitle() { return this._pageTitle; }
	get backTitle() { return this._backTitle; }
	get selectedIndex() { return this._selectedIndex; }
	get enabledTabs() { return this._enabledTabs; }
	get txtDrugs() { return this._txtDrugs; }
	get txtAdvice() { return this._txtAdvice; }
}
