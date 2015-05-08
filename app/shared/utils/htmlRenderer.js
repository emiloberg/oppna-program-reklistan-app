'use strict';

var Handlebars = require('../../node_modules/handlebars');

function HtmlRenderer() {}

	var templates = {};

	function registerTemplate(name, templateContent) {
		templates[name] = Handlebars.compile(templateContent);
	}

	return {
		registerTemplate: registerTemplate,
		processTemplate: processTemplate
	}
}

module.exports = HtmlRenderer;