const { MessageEmbed } = require('discord.js');
const BaseResponse = require('./BaseResponse');

class ErrorResponse extends BaseResponse {

	constructor(text, title) {
		const embed = new MessageEmbed();
		embed.setDescription(text);
		embed.setTitle(title);
		embed.setColor(0xDC3545);

		super('', [embed]);
	}
}

module.exports = ErrorResponse;