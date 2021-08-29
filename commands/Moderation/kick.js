const Discord = require('discord.js');

module.exports = {
	name: 'kick',
	category: 'Moderation',
	description: 'Kicks user from server with given reason',
	usage: '<User> <Reason>',
	permissions: 'KICK_MEMBERS',
	guildOnly: true,
	adminOnly: true,
	async execute(message, commandArguments) {
		const messageEmbed = new Discord.MessageEmbed();
		if (commandArguments.length >= 2) {
			const memberResolvable = commandArguments.shift().replace(/<|>|@|!/g, '');
			try {
				const member = await message.guild.members.fetch(memberResolvable);
				const kickReason = commandArguments.join(' ');
				await member.kick(kickReason);
				messageEmbed.setTitle('Kicked!');
				messageEmbed.setDescription(`Kicked user \`${member.user.username}\` for \`${kickReason}\``);
				const arcanusGuild = await message.client.arcanusClient.guilds.fetch(message.guild.id);
				if (message.guild.channels.cache.has(arcanusGuild.mod_log_channel.toString())) {
					const logEmbed = new Discord.MessageEmbed();
					logEmbed.setAuthor(`${message.author.username}#${message.author.discriminator} (${message.author.id})`, message.author.avatarURL());
					logEmbed.setDescription(`**Kicked:** ${member.user.username}#${member.user.discriminator} (${member.user.id})!\n**Reason:** ${kickReason}`);
					logEmbed.setThumbnail(member.user.avatarURL());

					message.guild.channels.cache.get(arcanusGuild.mod_log_channel.toString()).send(logEmbed);
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
		message.channel.send(messageEmbed);
	},
};