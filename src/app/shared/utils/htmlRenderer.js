'use strict';


const handlebars = require('handlebars/dist/handlebars');
const swag = require('swag');
const utils = require('./utils');
//import {inspect} from './debug';

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
		//var ret = context || '';
		//ret = ret.replace(/ /g, '_');
		//ret = removeDiacritics(ret);
		//ret = encodeURIComponent(ret);

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


let CSS = {};
let TEMPLATES = {};

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
	}
};





