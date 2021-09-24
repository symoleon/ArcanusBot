const BaseResponse = require('./BaseResponse');

class InfoResponse extends BaseResponse {

	constructor(text, title) {
		super(text, title, 0x17A2B8);
	}
}

module.exports = InfoResponse;