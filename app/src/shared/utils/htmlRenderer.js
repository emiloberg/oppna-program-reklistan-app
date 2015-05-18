'use strict';

//const Handlebars = require('../../node_modules/handlebars');

class HtmlRenderer {

	constructor() {
		this.templates = {};
	}

	registerTemplate(name, templateContent) {
		//this.templates[name] = Handlebars.compile(templateContent);
	}

	processTemplate(templateName, templateContext) {
		//var template = this.templates[templateName];
		//if (template === undefined) {
		//	throw Error('No such Template registered');
		//}
		//return template(templateContext);
	}
}

export default HtmlRenderer;
