const { MessageEmbed } = require('discord.js');

class BaseResponse {
	constructor(text, title, color) {
		this.text = text;
		this.title = title;
		this.color = color;
	}

	makeMessageObject() {
		const embed = new MessageEmbed();
		embed.setTitle(this.title);
		embed.setDescription(this.text);
		embed.setColor(this.color);
		return { embeds: [embed] };
	}
}

module.exports = BaseResponse;