const BaseResponse = require('./BaseResponse');

class ErrorResponse extends BaseResponse {

	constructor(text, title) {
		super(text, title, 0xDC3545);
	}
}

module.exports = ErrorResponse;