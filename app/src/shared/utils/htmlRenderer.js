'use strict';

const Handlebars = require('../../node_modules/handlebars');

class HtmlRenderer {

	constructor() {
		this.templates = {};
	}

	registerTemplate(name, templateContent) {
		this.templates[name] = Handlebars.compile(templateContent);
	}

	processTemplate(templateName, templateContent) {
		var template = this.templates[templateName];
		if (template === undefined) {
			throw Error('No such Template registered');
		}
		return template(templateContent);
	}
}

module.exports = HtmlRenderer;