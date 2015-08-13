'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _debug = require('./debug');

var _remoteimages = require('./remoteimages');

var _remoteimages2 = _interopRequireDefault(_remoteimages);

var handlebars = require('handlebars/dist/handlebars');
var swag = require('swag');
var utils = require('./utils');

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

var CSS = {};
var TEMPLATES = {};

var templatesModel = {
	registerTemplate: function registerTemplate(templateName, templateContent) {
		TEMPLATES[templateName] = handlebars.compile(templateContent);
	},

	processTemplate: function processTemplate(templateName, templateContext) {
		return rewriteHTML(TEMPLATES[templateName](templateContext));
	},

	registerCss: function registerCss(cssName, cssContent) {
		CSS[cssName] = cssContent;
	},

	getCss: function getCss(cssName) {
		return CSS[cssName];
	}
};

exports.templatesModel = templatesModel;
/**
 * Rewrites html elements to something NativeScript can understand
 *
 * Prefixing links with
 * 		rek:// for internal links,
 * 		rekhttps:// for externa https links
 * 		rekhttp:// for externa http links
 * 		rekmail:// for mailto links
 *
 * Setting image src to file://... internal urls. Also setting
 * the original url in 'data-remotesrc' property, to be able to fetch
 * it and download the links in other function.
 *
 * @param {string} html
 * @returns {string}
 */
function rewriteHTML(html) {
	var reInteralLinks = new RegExp(/href=([\"\'])#\/([^\"\']+)([\"\'])/gi);
	html = html.replace(reInteralLinks, 'href="rek://$2"');

	var reExternalHttpsLinks = new RegExp(/href=([\"\'])https\:\/\/([^\"\']+)([\"\'])/gi);
	html = html.replace(reExternalHttpsLinks, 'href="rekhttps://$2"');

	var reExternalHttpLinks = new RegExp(/href=([\"\'])http\:\/\/([^\"\']+)([\"\'])/gi);
	html = html.replace(reExternalHttpLinks, 'href="rekhttp://$2"');

	var reMailLinks = new RegExp(/href=([\"\'])mailto\:([^\"\']+)([\"\'])/gi);
	html = html.replace(reMailLinks, 'href="rekmail://$2"');

	var reImages = new RegExp(/src=[\"\']([^\"\']+)[\"\']/gi);
	html = html.replace(reImages, function (match, capture) {
		return 'src="file://' + _remoteimages2['default'].imageFolderPath() + '/' + utils.makeUrlSafe(capture) + '" data-remotesrc="' + capture + '"';
	});

	return html;
}