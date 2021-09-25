const BaseResponse = require('./BaseResponse');
const { MessageEmbed } = require('discord.js');

class EmbedResponse extends BaseResponse {

	constructor() {
		super();
		this.type = 'INFO';
		this.title = '';
		this.fields = [];
	}

	makeMessageObject() {
		const embed = new MessageEmbed();
		embed.setDescription(this.text);
		embed.setTitle(this.title);
		switch (this.type) {
			case 'SUCCESS':
				embed.setColor(0x28A745);
				break;
			case 'INFO':
				embed.setColor(0x17A2B8);
				break;
			case 'WARNING':
				embed.setColor(0xFFC107);
				break;
			case 'ERROR':
				embed.setColor(0xDC3545);
			default:
				break;
		}
		if (this.fields) {
			embed.addFields(this.fields);
		}
		this.embeds = [embed];

		return super.makeMessageObject();
	}
	setText(text) {
		this.text = text;
		return this;
	}
	setTitle(title) {
		this.title = title;
		return this;
	}
	addField(field) {
		this.fields.push(field);
		return this;
	}
	setType(type) {
		this.type = type;
		return this;
	}
}

module.exports = EmbedResponse;