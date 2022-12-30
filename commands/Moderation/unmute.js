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
	async execute(interaction) {
		const response = new EmbedResponse();
		response.setType('WARNING');
		if (interaction.options.data.length >= 2) {
			try {
				const member = interaction.options.getMember('user');
				const unmuteReason = interaction.options.getString('reason');
				const arcanusGuild = await interaction.client.arcanusClient.guilds.fetch(interaction.guild.id);
				// const arcanusGuildMember = await arcanusGuild.getMember(member.id);
				if (member.isCommunicationDisabled()) {
					// await arcanusGuild.mutesManager.delete(arcanusGuildMember.muteId);
					// const role = await message.guild.roles.fetch(arcanusGuild.mute_role_id.toString());
					// await member.roles.remove(role);
					await member.timeout(null, unmuteReason);
					if (interaction.guild.channels.cache.has(arcanusGuild.modLogChannel.toString())) {
						const logEmbed = new Discord.EmbedBuilder();
						logEmbed.setAuthor({
							name: `${interaction.user.username}#${interaction.user.discriminator} (${interaction.user.id})`,
							iconURL: interaction.user.avatarURL(), 
						});
						logEmbed.setDescription(`**Unmuted:** ${member.user.username}#${member.user.discriminator} (${member.user.id})!\n**Reason:** ${unmuteReason}`);
						logEmbed.setThumbnail(member.user.avatarURL());

						interaction.guild.channels.cache.get(arcanusGuild.modLogChannel.toString()).send({ embeds: [logEmbed] });
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
					response.setText(`I can't find that user.`);
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