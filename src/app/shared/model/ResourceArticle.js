'use strict';

import language from './../utils/language';
import navigation from './../utils/navigation';
import * as frameModule from 'ui/frame';

export default class ResourceArticle {
	constructor(uuid, title, body, externalLink, sortOrder) {
		this._uuid = uuid;
		this._title = title;
		this._body = body;
		this._externalLink = externalLink;
		this._sortOrder = sortOrder;
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
	get sortOrder() { return this._sortOrder; }
	get isExternal() {
		return (this._externalLink.length > 0);
	}

	navigateToResourceArticle(args) {
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
