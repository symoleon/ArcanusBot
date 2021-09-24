const { MessageEmbed } = require('discord.js');
const BaseResponse = require('./BaseResponse');

class InfoResponse extends BaseResponse {

	constructor(text, title) {
		const embed = new MessageEmbed();
		embed.setDescription(text);
		embed.setTitle(title);
		embed.setColor(0x17A2B8);

		super('', [embed]);
	}
}

module.exports = InfoResponse;