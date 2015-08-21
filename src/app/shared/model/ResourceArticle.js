'use strict';

import Images from './../utils/images';
import Mainmenu from './../viewmodel/Mainmenu';
import navigation from './../utils/navigation';

const frameModule = require('ui/frame');

export default class ResourceArticle {

	constructor(uuid, title, body, externalLink, sortOrder) {
		this._uuid = uuid;
		this._title = title;
		this._body = body;
		this._externalLink = externalLink;
		this._sortOrder = sortOrder;

		if (externalLink.length > 0) {
			this._icon = Images.external;
		} else {
			this._icon = '';
		}
	}

	get uuid() { return this._uuid; }
	get title() { return this._title; }
	get body() { return this._body; }
	get externalLink() { return this._externalLink; }
	get sortOrder() { return this._sortOrder; }
	get icon() { return this._icon; }
	get isExternal() {
		return (this._externalLink.length > 0);
	}

	navigateToResourceArticle(args) {
		Mainmenu.hide(function() {

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
		});
	}
}
