const Discord = require('discord.js');
const EmbedResponse = require('../src/system/responses/EmbedResponse');

module.exports = {
	name: 'messageCreate',
	once: false,
	async execute(message, config, client) {
		if (message.author.id == '302050872383242240' && ((message.embeds[0].description.match('Podbito serwer') != null) || (message.embeds[0].description.match('Bump done') != null))) {
			client.emit('bump', message);
		}
		if (!(message.content.startsWith(config.botMention) || message.content.startsWith(config.prefix) || message.content.startsWith(config.botMentionWithExclamationMark)) || message.author.bot) return;

		const commandContent = message.content.replace(config.botMention, '').replace(config.botMentionWithExclamationMark, '').replace(config.prefix, '').trim();
		const commandArguments = commandContent.split(/ +/);
		const command = commandArguments.shift();

		if (!client.commands.has(command)) return;

		if ((client.commands.get(command).guildOnly == true || client.commands.get(command).adminOnly == true) && (message.channel.type != 'GUILD_TEXT' && message.channel.type != 'GUILD_NEWS')) {
			const embed = new Discord.MessageEmbed();
			embed.setTitle('This command is available only in guilds!');
			embed.setDescription('To execute this command you must use it in guild\'s channel!');
			message.channel.send({ embeds: [embed] });
			return;
		}

		try {
			if (client.commands.get(command).adminOnly == true) {
				const arcanusGuild = await client.arcanusClient.guilds.fetch(message.guild.id);
				let hasAdminRole = false;
				for (const element of message.member.roles.cache) {
					const isAdmin = await arcanusGuild.isAdmin(element[1].id);
					if (isAdmin) {
						hasAdminRole = true;
						break;
					}
				}
				if (!hasAdminRole) {
					const embed = new Discord.MessageEmbed();
					embed.setTitle('Insufficient permissions!');
					embed.setDescription('You don\'t have permissions to execute this command!');
					message.channel.send({ embeds: [embed] });
					return;
				}
			}
			const response = await client.commands.get(command).execute(message, commandArguments);
			if (Array.isArray(response)) {
				response.forEach(responseItem => {
					message.reply(responseItem.makeMessageObject());
				});
			} else {
				message.reply(response.makeMessageObject());
			}
		} catch (error) {
			const response = new EmbedResponse();
			response.setType('ERROR');
			if (error.code == 50013) {
				response.setTitle('No permissions');
				response.setText('I can\'t do that! I\'m lack permissions!')
			} else {
				console.log(error);
				response.setTitle('Error');
				response.setText('There was an error during execution of this command!');
			}
			message.channel.send(response.makeMessageObject());
		}
	},
};