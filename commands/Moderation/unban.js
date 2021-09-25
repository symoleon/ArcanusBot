const Discord = require('discord.js');
const EmbedResponse = require('../../src/system/responses/EmbedResponse');

module.exports = {
	name: 'unban',
	category: 'Moderation',
	description: 'Unban user for given reason',
	usage: '<User> <Reason>',
	permissions: 'BAN_MEMBER',
	guildOnly: true,
	adminOnly: true,
	async execute(message, commandArguments) {
		const response = new EmbedResponse();
		response.setType('WARNING');
		if (commandArguments.length >= 2) {
			const userResolvable = commandArguments.shift().replace(/<|>|@|!/g, '');
			try {
				const user = await message.client.users.fetch(userResolvable);
				const unbanReason = commandArguments.join(' ');
				await message.guild.members.unban(user, unbanReason);
				response.setType('SUCCESS');
				response.setTitle('Unbanned!');
				response.setText(`Unbanned user \`${user.username}\` for \`${unbanReason}\``);
				const arcanusGuild = await message.client.arcanusClient.guilds.fetch(message.guild.id);
				if (message.guild.channels.cache.has(arcanusGuild.mod_log_channel.toString())) {
					const logEmbed = new Discord.MessageEmbed();
					logEmbed.setAuthor(`${message.author.username}#${message.author.discriminator} (${message.author.id})`, message.author.avatarURL());
					logEmbed.setDescription(`**Unbanned:** ${user.username}#${user.discriminator} (${user.id})!\n**Reason:** ${unbanReason}`);
					logEmbed.setThumbnail(user.avatarURL());

					message.guild.channels.cache.get(arcanusGuild.mod_log_channel.toString()).send({ embeds: [logEmbed] });
				}
			} catch (error) {
				if (error.code == 10013) {
					response.setTitle('Invalid user!');
					response.setText(`I can't find user with \`${userResolvable}\` name or ID.`);
				} else {
					throw error;
				}
			}
		} else {
			response.setTitle('Not enough arguments!');
			response.setText(`Provide additional arguments or use \`help ${this.name}\` command.`);
		}
		return response
	},
};