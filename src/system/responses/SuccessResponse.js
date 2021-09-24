const BaseResponse = require('./BaseResponse');

class SuccessResponse extends BaseResponse {

	constructor(text, title) {
		super(text, title, 0x28A745);
	}
}

module.exports = SuccessResponse;