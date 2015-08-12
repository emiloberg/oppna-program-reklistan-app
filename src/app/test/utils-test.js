/*global describe, it*/
import {makeUrlSafe} from '../shared/utils/utils';

import {expect} from '../../node_modules/chai';
describe('Utils', () => {
	it('should ASCII-normalize correctly', () => {
		const unicode = 'AꜲÆꜴꜶꜸꜼBCDǱǲEFGHIJKLǇǈMNǊǋOƢꝎȢPQRSTꜨUVꝠWXYZaꜳæꜵꜷꜹꜽbcdǳefghƕijklǉmnǌoƣȣꝏpqrstꜩuvꝡwxyz';
		const normalized = makeUrlSafe(unicode);
		const expected = 'AAAAEAOAUAVAYBCDDZDzEFGHIJKLLJLjMNNJNjOOIOOOUOEoePQRSTTZUVVYWXYZaaaaeaoauavaybcddzefghhvijklljmnnjooiouoopqrsttzuvvywxyz';
		expect(normalized).to.equal(expected);
	});
});
