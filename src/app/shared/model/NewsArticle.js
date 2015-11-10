'use strict';

//import {inspect} from './../utils/debug';
import language from './../utils/language';
import navigation from './../utils/navigation';
import * as frameModule from 'ui/frame';

export default class NewsArticle {
	constructor(uuid, title, body, externalLink, lead, date) {
		this._uuid = uuid;
		this._title = title;
		this._body = body;
		this._externalLink = externalLink;
		this._lead = lead;
		this._date = date;
	}

	get uuid() { return this._uuid; }
	get title() {
		let title = this._title;
		if (this.isExternal) {
			title = title + language.externalLinkSlug;
		}
		return title;
	}
	get body() { return this._body; }
	get externalLink() { return this._externalLink; }
	get lead() { return this._lead; }
	get date() { return this._date; }

	get isExternal() {
		return (this._externalLink.length > 0);
	}

	navigateToNewsArticle(args) {

			// TODO: Hide menu if needed
			if(args.view.bindingContext.isExternal) {
				navigation.navigateToExternalUrl(args.view.bindingContext.externalLink);
			} else {
				frameModule.topmost().navigate({
					moduleName: 'views/details',
					context: {
						type: 'plainArticle',
						data: args.view.bindingContext
					}
				});
			}
	}
}
