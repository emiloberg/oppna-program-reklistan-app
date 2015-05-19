let TEMPLATES = [];

export const templatesViewModel = {
	addTemplate(templateName, templateContent) {
		TEMPLATES.push({
			name: templateName,
			content: templateContent
		});

	},

	get templates() {
		return TEMPLATES;
	}

};
