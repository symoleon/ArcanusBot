const Discord = require('discord.js');

module.exports = {
	name: 'mute',
	category: 'Moderation',
	description: 'Mute an user',
	usage: '<User> <Time> <Description>',
	permission: '',
	guildOnly: true,
	adminOnly: true,
	async execute(message, commandArguments) {
		const messageEmbed = new Discord.MessageEmbed();
		if (commandArguments.length >= 3) {
			const memberResolvable = commandArguments.shift().replace(/<|>|@|!/g, '');
			try {
				const member = await message.guild.members.fetch(memberResolvable);
				const providedDuration = commandArguments.shift();
				let durationInSeconds = 0;
				let durationReadable = '';
				switch (providedDuration.at(-1)) {
				case 's':
					durationInSeconds = parseInt(providedDuration.slice(0, -1));
					durationReadable = `${durationInSeconds} ${(durationInSeconds == 1) ? 'second' : 'seconds'}`;
					break;
				case 'm':
					durationInSeconds = parseInt(providedDuration.slice(0, -1)) * 60;
					durationReadable = `${durationInSeconds / 60} ${(durationInSeconds / 60 == 1) ? 'minute' : 'minutes'}`;
					break;
				case 'h':
					durationInSeconds = parseInt(providedDuration.slice(0, -1)) * 60 * 60;
					durationReadable = `${durationInSeconds / 60 / 60} ${(durationInSeconds / 60 / 60 == 1) ? 'hour' : 'hours'}`;
					break;
				default:
					durationInSeconds = parseInt(providedDuration);
					durationReadable = `${durationInSeconds} seconds`;
					break;
				}
				if (!isNaN(durationInSeconds)) {
					const muteDescription = commandArguments.join(' ');
					const arcanusGuild = await message.client.arcanusClient.getGuild(message.guild.id);
					const arcanusGuildMember = await message.client.arcanusClient.getGuildMember(arcanusGuild, member.id);
					if (!arcanusGuildMember.muteId) {
						await arcanusGuild.mutesManager.mute(arcanusGuildMember, message.author.id, muteDescription, durationInSeconds);
						const role = await message.guild.roles.fetch(arcanusGuild.mute_role_id.toString());
						await member.roles.add(role);
						if (message.guild.channels.cache.has(arcanusGuild.mod_log_channel.toString())) {
							const logEmbed = new Discord.MessageEmbed();
							logEmbed.setAuthor(`${message.author.username}#${message.author.discriminator} (${message.author.id})`, message.author.avatarURL());
							logEmbed.setDescription(`**Muted:** ${member.user.username}#${member.user.discriminator} (${member.user.id})!\n**Reason:** ${muteDescription}`);
							logEmbed.setThumbnail(member.user.avatarURL());
							logEmbed.setFooter(`Duration: ${durationReadable}`);

							message.guild.channels.cache.get(arcanusGuild.mod_log_channel.toString()).send(logEmbed);
						}
						messageEmbed.setTitle('Muted!');
						messageEmbed.setDescription(`Muted user \`${member.user.username}\` for \`${muteDescription}\`\nDuration: \`${durationReadable}\``);
					} else {
						messageEmbed.setTitle('Already muted!');
						messageEmbed.setDescription(`User \`${member.user.username}\` is already muted!`);
					}
				} else {
					messageEmbed.setTitle('Invalid duration!');
					messageEmbed.setDescription(`Provided duration \`${providedDuration}\` is not valid!`);
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