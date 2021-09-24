const { MessageEmbed } = require('discord.js');
const BaseResponse = require('./BaseResponse');

class WarningResponse extends BaseResponse {

	constructor(text, title) {
		const embed = new MessageEmbed();
		embed.setDescription(text);
		embed.setTitle(title);
		embed.setColor(0xFFC107);

		super('', [embed]);
	}
}

module.exports = WarningResponse;