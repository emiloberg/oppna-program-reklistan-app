'use strict';

var Handlebars = require('../../node_modules/handlebars');

function HtmlRenderer() {

	var templates = {};

	function registerTemplate(name, templateContent) {
		if (name === undefined || name === '') {
			throw Error('Name cannot be empty!');
		}
		templates[name] = Handlebars.compile(templateContent);
	}

	function processTemplate(templateName, templateContent) {
		var template = templates[templateName];
		if (template === undefined) {
			throw Error('No such Template registered');
		}
		return template(templateContent);
	}

	return {
		registerTemplate: registerTemplate,
		processTemplate: processTemplate
	}
}

module.exports = HtmlRenderer;