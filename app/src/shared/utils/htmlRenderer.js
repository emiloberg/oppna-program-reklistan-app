'use strict';
//
////const Handlebars = require('../../node_modules/handlebars');
//
//class HtmlRenderer {
//
//	constructor() {
//		this.templates = {};
//	}
//
//	registerTemplate(name, templateContent) {
//		this.templates[name] = templateContent;
//		//this.templates[name] = Handlebars.compile(templateContent);
//	}
//
//	processTemplate(templateName, templateContext) {
//		//var template = this.templates[templateName];
//		//if (template === undefined) {
//		//	throw Error('No such Template registered');
//		//}
//		//return template(templateContext);
//	}
//}
//
//export default HtmlRenderer;
//

const handlebars = require('./../../node_modules/handlebars/dist/handlebars');
const swag = require('./../../node_modules/swag');

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
		var ret = context || '';
		ret = ret.replace(/ /g, '_');
		ret = removeDiacritics(ret);
		ret = encodeURIComponent(ret);

		return new handlebars.SafeString(ret);
	});

	/**
	 * Parse the text and do some replacing
	 *
	 * Usage:
	 * {{markdownify variable}}
	 */
	handlebars.registerHelper('markdownify', function (context) {
		var text = context || '';

		// Convert markdown links to html links
		text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="\$2">\$1</a>');

		// Convert {{replaceable}} with icon
		text = text.replace(/\{\{replaceable\}\}/g, '<span class="replaceable">&#8860;</span>');
		text = text.replace(/\{\{child\}\}/g, '<img src="/reklistan-theme/images/theme/child.png" class="child-icon">');

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
		return TEMPLATES[templateName](templateContext);
	},

	registerCss(cssName, cssContent) {
		CSS[cssName] = cssContent;
	},

	getCss(cssName) {
		return CSS[cssName];
	}
};

