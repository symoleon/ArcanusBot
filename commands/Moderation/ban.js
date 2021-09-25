const Discord = require('discord.js');
const EmbedResponse = require('../../src/system/responses/EmbedResponse');

module.exports = {
	name: 'ban',
	category: 'Moderation',
	description: 'Ban user for give reason',
	usage: '<User> <Reason>',
	permissions: 'BAN_MEMBER',
	guildOnly: true,
	adminOnly: true,
	async execute(message, commandArguments) {
		const response = new EmbedResponse;
		response.setType('WARNING');
		if (commandArguments.length >= 2) {
			const memberResolvable = commandArguments.shift().replace(/<|>|@|!/g, '');
			try {
				const member = await message.guild.members.fetch(memberResolvable);
				const banReason = commandArguments.join(' ');
				await member.ban({ reason: banReason });
				response.setType('SUCCESS');
				response.setTitle('Banned!');
				response.setText(`Banned user \`${member.user.username}\` for \`${banReason}\``);
				const arcanusGuild = await message.client.arcanusClient.guilds.fetch(message.guild.id);
				if (message.guild.channels.cache.has(arcanusGuild.mod_log_channel.toString())) {
					const logEmbed = new Discord.MessageEmbed();
					logEmbed.setAuthor(`${message.author.username}#${message.author.discriminator} (${message.author.id})`, message.author.avatarURL());
					logEmbed.setDescription(`**Banned:** ${member.user.username}#${member.user.discriminator} (${member.user.id})!\n**Reason:** ${banReason}`);
					logEmbed.setThumbnail(member.user.avatarURL());

					message.guild.channels.cache.get(arcanusGuild.mod_log_channel.toString()).send({ embeds: [logEmbed] });
				}
			} catch (error) {
				if (error.code == 10013) {
					response.setTitle('Invalid user!');
					response.setText(`I can't find user with \`${memberResolvable}\` name or ID.`);
				} else {
					throw error;
				}
			}
		} else {
			response.setTitle('Not enough arguments!');
			response.setText(`Provide additional arguments or use \`help ${this.name}\` command.`);
		}
		return response;
	},
};