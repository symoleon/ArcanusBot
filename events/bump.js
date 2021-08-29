const Discord = require('discord.js');

module.exports = {
	name: 'bump',
	once: false,
	async execute(message, config, client) {
		const date = new Date();
		const offset = (date.getTimezoneOffset() + 120) / 60;
		let godzina = ((date.getHours() + offset + 2) % 24);
		let minuta = date.getMinutes();
		if (godzina < 10) {
			godzina = '0' + godzina.toString();
		}
		if (minuta < 10) {
			minuta = '0' + minuta.toString();
		}
		const embed = new Discord.MessageEmbed().setDescription('Next bump will be available after ' + godzina + ':' + minuta + '.');
		embed.setFooter(`From ${client.user.username}`);
		message.channel.send(embed);
	},
};