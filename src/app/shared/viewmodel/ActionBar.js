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

	/**
	 * Creates a new ActionBar
	 *
	 * @param {object} [options={}]
	 * @param {string} [options.pageTitle=] Current page title
	 * @param {string} [options.backTitle=] Previous page title
	 * @param {string} [options.enabledTabs=both] 'both', 'drugs' or 'advice'
	 * @param {string} [options.barType=normal] 'normal' or 'onlyClose'
	 * @param {boolean} [options.useLastPageTitle=false] Use last page title instead of pageTitle
	 * @param {number} [options.selectedIndex] Using last selected index if left unset
	 */
	constructor(options = {}) {

		let params = {
			pageTitle: '',
			backTitle: '',
			enabledTabs: 'both',
			barType: 'normal',
			useLastPageTitle: false,
			selectedIndex: lastSetSelectedIndex
		};
		params = Object.assign(params, options);

		if(params.selectedIndex === undefined) {
			params.selectedIndex = lastSetSelectedIndex;
		}

		super();
		this._iconBack = Images.left;
		this._iconSearch = Images.search;
		this._iconMenu = Images.menu;
		this._pageTitle = params.pageTitle;
		this._backTitle = params.useLastPageTitle ? lastPageTitle : params.backTitle;
		this._selectedIndex = params.selectedIndex;
		this._enabledTabs = params.enabledTabs;
		this._txtDrugs = language.drugs;
		this._txtAdvice = language.advice;

		if (params.barType === 'normal') {
			this._iconClose = Images.close;
		}

		lastPageTitle = params.pageTitle;
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
