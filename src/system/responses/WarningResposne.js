const BaseResponse = require('./BaseResponse');

class WarningResponse extends BaseResponse {

	constructor(text, title) {
		super(text, title, 0xFFC107);
	}
}

module.exports = WarningResponse;