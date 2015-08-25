'use strict';
import Images from './../utils/images';
import language from './../utils/language';
import {Observable} from 'data/observable';

let lastPageTitle = '';
let lastSetSelectedIndex = 0;

export default class ActionBar extends Observable {
	/**
	 * @param {string} pageTitle Current page title.
	 * @param {string} backTitle Title of back button.
	 * @param {number} selectedIndex 0 for drugs and 1 for advice.
	 * @param {string} enabledTabs One of: [both, drugs, advice, none].
	 */
	constructor(pageTitle, backTitle, selectedIndex, enabledTabs = 'both', ActionBarType = 'normal', useLastPageTitle = '') {
		super();
		this._iconBack = Images.left;
		this._iconSearch = Images.search;
		this._iconMenu = Images.menu;
		this._pageTitle = pageTitle;
		this._backTitle = (useLastPageTitle === 'useLastPageTitle') ? lastPageTitle : backTitle;
		//this._selectedIndex = selectedIndex;
		this._selectedIndex = lastSetSelectedIndex;
		this._enabledTabs = enabledTabs;
		this._txtDrugs = language.drugs;
		this._txtAdvice = language.advice;

		if (ActionBarType) {
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
