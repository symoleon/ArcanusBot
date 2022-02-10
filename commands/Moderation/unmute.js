const Discord = require('discord.js');
const EmbedResponse = require('../../src/system/responses/EmbedResponse');

module.exports = {
	name: 'unmute',
	category: 'Moderation',
	description: 'Unmute an user',
	usage: '<User> <Reason>',
	permissions: '',
	guildOnly: true,
	adminOnly: true,
	async execute(message, commandArguments) {
		const response = new EmbedResponse();
		response.setType('WARNING');
		if (commandArguments.length >= 2) {
			const userResolvable = commandArguments.shift().replace(/<|>|@|!/g, '');
			try {
				const member = await message.guild.members.fetch(userResolvable);
				const unmuteReason = commandArguments.join(' ');
				const arcanusGuild = await message.client.arcanusClient.guilds.fetch(message.guild.id);
				// const arcanusGuildMember = await arcanusGuild.getMember(member.id);
				if (member.isCommunicationDisabled()) {
					// await arcanusGuild.mutesManager.delete(arcanusGuildMember.muteId);
					// const role = await message.guild.roles.fetch(arcanusGuild.mute_role_id.toString());
					// await member.roles.remove(role);
					await member.timeout(null, unmuteReason);
					if (message.guild.channels.cache.has(arcanusGuild.modLogChannel.toString())) {
						const logEmbed = new Discord.MessageEmbed();
						logEmbed.setAuthor({
							name: `${message.author.username}#${message.author.discriminator} (${message.author.id})`,
							iconURL: message.author.avatarURL(), 
						});
						logEmbed.setDescription(`**Unmuted:** ${member.user.username}#${member.user.discriminator} (${member.user.id})!\n**Reason:** ${unmuteReason}`);
						logEmbed.setThumbnail(member.user.avatarURL());

						message.guild.channels.cache.get(arcanusGuild.modLogChannel.toString()).send({ embeds: [logEmbed] });
					}
					response.setType('SUCCESS');
					response.setTitle('Unmuted!');
					response.setText(`User \`${member.user.username}\` has been unmuted for \`${unmuteReason}\``);
				} else {
					response.setTitle('Not muted!');
					response.setText(`User \`${member.user.username}\` is not muted!`);
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
		return response;
	},
};