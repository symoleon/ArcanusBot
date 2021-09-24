const { MessageEmbed } = require('discord.js');
const BaseResponse = require('./BaseResponse');

class SuccessResponse extends BaseResponse {

	constructor(text, title) {
		const embed = new MessageEmbed();
		embed.setDescription(text);
		embed.setTitle(title);
		embed.setColor(0x28A745);

		super('', [embed]);
	}
}

module.exports = SuccessResponse;