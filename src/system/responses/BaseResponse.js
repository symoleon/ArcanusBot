class BaseResponse {
	constructor(content, embeds) {
		this.content = content;
		this.embeds = embeds;
	}

	makeMessageObject() {
		const object = {
			allowedMentions: {
				repliedUser: false,
			},
		};
		if (this.content) {
			object.content = this.content;
		}
		if (this.embeds) {
			object.embeds = this.embeds;
		}

		return object;
	}
}

module.exports = BaseResponse;