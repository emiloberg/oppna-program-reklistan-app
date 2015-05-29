'use strict';


const handlebars = require('./../../node_modules/handlebars/dist/handlebars');
const swag = require('./../../node_modules/swag');
const customUtils = require('./utils');
import {inspect} from './debug';


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

		return new handlebars.SafeString(customUtils.makeUrlSafe(context));
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
		return rewriteHTML(TEMPLATES[templateName](templateContext));
	},

	registerCss(cssName, cssContent) {
		CSS[cssName] = cssContent;
	},

	getCss(cssName) {
		return CSS[cssName];
	}
};

/**
 * Rewrites html elements such as links to something NativeScript can
 * understand
 *
 * @param html
 * @returns {string}
 */
function rewriteHTML(html) {
	const reInteralLinks = new RegExp(/href=([\"\'])#\/([^\"\']+)([\"\'])/gi);
	html = html.replace(reInteralLinks, 'href="rek://$2"');

	const reExternalHttpsLinks = new RegExp(/href=([\"\'])https\:\/\/([^\"\']+)([\"\'])/gi);
	html = html.replace(reExternalHttpsLinks, 'href="rekhttps://$2"');

	const reExternalHttpLinks = new RegExp(/href=([\"\'])http\:\/\/([^\"\']+)([\"\'])/gi);
	html = html.replace(reExternalHttpLinks, 'href="rekhttp://$2"');

	const reMailLinks = new RegExp(/href=([\"\'])mailto\:([^\"\']+)([\"\'])/gi);
	html = html.replace(reMailLinks, 'href="rekmail://$2"');

	// todo, rewrite images as well

	return html;
}