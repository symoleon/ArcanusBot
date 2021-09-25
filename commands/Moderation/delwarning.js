const Discord = require('discord.js');
const EmbedResponse = require('../../src/system/responses/EmbedResponse');

module.exports = {
	name: 'delwarning',
	category: 'Moderation',
	description: 'Delete user\'s warning',
	usage: '<user> <warningId>',
	permissions: '',
	guildOnly: true,
	adminOnly: true,
	async execute(message, commandArguments) {
		const response = new EmbedResponse();
		response.setType('WARNING');
		if (commandArguments.length >= 2) {
			const memberResolvable = commandArguments.shift().replace(/<|>|@|!/g, '');
			try {
				const member = await message.guild.members.fetch(memberResolvable);
				const warningId = commandArguments.shift();
				const arcanusGuild = await message.client.arcanusClient.getGuild(message.guild.id);
				const arcanusGuildMember = await message.client.arcanusClient.getGuildMember(arcanusGuild, member.id);
				if (arcanusGuildMember.warningsManager.warningsIds.indexOf(warningId) != -1) {
					const warning = await arcanusGuildMember.warningsManager.fetch(warningId);
					await arcanusGuildMember.warningsManager.delete(warningId);
					if (message.guild.channels.cache.has(arcanusGuild.mod_log_channel.toString())) {
						const logEmbed = new Discord.MessageEmbed();
						logEmbed.setAuthor(`${message.author.username}#${message.author.discriminator} (${message.author.id})`, message.author.avatarURL());
						logEmbed.setDescription(`**Deleted warning:** ${warning.description} (${warning.id})\n**From:** ${member.user.username}#${member.user.discriminator} (${member.user.id})!`);
						logEmbed.setThumbnail(member.user.avatarURL());

						message.guild.channels.cache.get(arcanusGuild.mod_log_channel.toString()).send({ embeds: [logEmbed] });
					}
					response.setType('SUCCESS');
					response.setTitle('Warning deleted!');
					response.setText(`Warning with ID \`${warningId}\` has been deleted!`);
				} else {
					response.setTitle('Invalid warning ID!');
					response.setText(`User \`${member.user.id}\` don't have warn with id \`${warningId}\``);
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