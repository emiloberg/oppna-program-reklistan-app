
import HtmlRenderer from '../shared/utils/htmlRenderer';

import {expect} from '../../node_modules/chai';

describe('htmlRenderer', () => {

	let htmlRenderer;

	beforeEach(() => {
		htmlRenderer = new HtmlRenderer();
	});

	it('should register and compile Template', () => {
		htmlRenderer.registerTemplate('name', 'templateContent');
	});


	it('should process templates correctly', () => {

		htmlRenderer.registerTemplate('name', '{{key}}');
		let result = htmlRenderer.processTemplate('name', {});
		expect(result).to.equal('');

		result = htmlRenderer.processTemplate('name', {key: 'value'});
		expect(result).to.equal('value');		
	});

}) 