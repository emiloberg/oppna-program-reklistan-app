'use strict';

class HTTPGENERIC extends Error {
	constructor(msg = '') {
		super();
		this.message = msg;
		this.name = 'HTTPGENERIC';
	}
}

const REKError = {
	HTTPGENERIC
};

export default REKError;
