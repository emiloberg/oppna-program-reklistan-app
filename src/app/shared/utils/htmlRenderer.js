'use strict';


import * as handlebars from 'handlebars/dist/handlebars';
import * as swag from 'swag';
import * as utils from './utils';

let CSS = {};
let TEMPLATES = {};
let IN_APP_RESOURCES = {};

(function registerHelpers() {

	swag.registerHelpers(handlebars);

	/**
	 * Make URL safe URL
	 *
	 * Usage:
	 * {{urlencode variable}}
	 *
	 */
	handlebars.registerHelper('urlencode', function (context) {
		return new handlebars.SafeString(utils.makeUrlSafe(context));
	});

	/**
	 * Stub. In the web version we do the markdownify on-the-fly. Here in the app version
	 * we're doing it elsewhere (utils/utils.js/rewriteHTML()). For the same handlebars
	 * template to work at both app och web we still need this helper stub here.
	 *
	 * Usage:
	 * {{markdownify variable}}
	 */
	handlebars.registerHelper('markdownify', function (context) {
		var text = context || '';
		return new handlebars.SafeString(text);
	});
})();

export const templatesModel = {
	registerTemplate(templateName, templateContent) {
		TEMPLATES[templateName] = handlebars.compile(templateContent);
	},

	processTemplate(templateName, templateContext) {
		return utils.rewriteHTML(TEMPLATES[templateName](templateContext));
	},

	registerCss(cssName, cssContent) {
		CSS[cssName] = cssContent;
	},

	getCss(cssName) {
		return CSS[cssName];
	},

	registerInAppResource(name, content) {
		IN_APP_RESOURCES[name] = content;
	},

	getInAppResource(name) {
		return IN_APP_RESOURCES[name];
	}
};
