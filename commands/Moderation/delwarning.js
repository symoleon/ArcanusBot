const Discord = require('discord.js');

module.exports = {
	name: 'delwarning',
	category: 'Moderation',
	description: 'Delete user\'s warning',
	usage: '<user> <warningId>',
	permissions: '',
	guildOnly: true,
	adminOnly: true,
	async execute(message, commandArguments) {
		const messageEmbed = new Discord.MessageEmbed();
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
					messageEmbed.setTitle('Warning deleted!');
					messageEmbed.setDescription(`Warning with ID \`${warningId}\` has been deleted!`);
				} else {
					messageEmbed.setTitle('Invalid warning ID!');
					messageEmbed.setDescription(`User \`${member.user.id}\` don't have warn with id \`${warningId}\``);
				}
			} catch (error) {
				if (error.code == 10013) {
					messageEmbed.setTitle('Invalid user!');
					messageEmbed.setDescription(`I can't find user with \`${memberResolvable}\` name or ID.`);
				} else {
					throw error;
				}
			}
		} else {
			messageEmbed.setTitle('Not enough arguments!');
			messageEmbed.setDescription(`Provide additional arguments or use \`help ${this.name}\` command.`);
		}
		message.channel.send({ embeds: [messageEmbed] });
	},
};