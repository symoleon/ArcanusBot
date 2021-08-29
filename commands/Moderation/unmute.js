const Discord = require('discord.js');

module.exports = {
	name: 'unmute',
	category: 'Moderation',
	description: 'Unmute an user',
	usage: '<User> <Reason>',
	permissions: '',
	guildOnly: true,
	adminOnly: true,
	async execute(message, commandArguments) {
		const messageEmbed = new Discord.MessageEmbed();
		if (commandArguments.length >= 2) {
			const userResolvable = commandArguments.shift().replace(/<|>|@|!/g, '');
			try {
				const member = await message.guild.members.fetch(userResolvable);
				const unmuteReason = commandArguments.join(' ');
				const arcanusGuild = await message.client.arcanusClient.getGuild(message.guild.id);
				const arcanusGuildMember = await arcanusGuild.getMember(member.id);
				if (arcanusGuildMember.muteId) {
					await arcanusGuild.mutesManager.delete(arcanusGuildMember.muteId);
					if (message.guild.channels.cache.has(arcanusGuild.mod_log_channel.toString())) {
						const logEmbed = new Discord.MessageEmbed();
						logEmbed.setAuthor(`${message.author.username}#${message.author.discriminator} (${message.author.id})`, message.author.avatarURL());
						logEmbed.setDescription(`**Unmuted:** ${member.user.username}#${member.user.discriminator} (${member.user.id})!\n**Reason:** ${unmuteReason}`);
						logEmbed.setThumbnail(member.user.avatarURL());

						message.guild.channels.cache.get(arcanusGuild.mod_log_channel.toString()).send(logEmbed);
					}
					messageEmbed.setTitle('Unmuted!');
					messageEmbed.setDescription(`User \`${member.user.username}\` has been unmuted for \`${unmuteReason}\``);
				} else {
					messageEmbed.setTitle('Not muted!');
					messageEmbed.setDescription(`User \`${member.user.username}\` is not muted!`);
				}
			} catch (error) {
				if (error.code == 10013) {
					messageEmbed.setTitle('Invalid user!');
					messageEmbed.setDescription(`I can't find user with \`${userResolvable}\` name or ID.`);
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