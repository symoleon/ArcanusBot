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
	async execute(interaction) {
		const response = new EmbedResponse;
		response.setType('WARNING');
		if (interaction.options.data.length >= 2) {
			try {
				const member = interaction.options.getMember('user');
				const banReason = interaction.options.getString('reason');
				await member.ban({ reason: banReason });
				response.setType('SUCCESS');
				response.setTitle('Banned!');
				response.setText(`Banned user \`${member.user.username}\` for \`${banReason}\``);
				const arcanusGuild = await interaction.client.arcanusClient.guilds.fetch(interaction.guild.id);
				if (interaction.guild.channels.cache.has(arcanusGuild.modLogChannel.toString())) {
					const logEmbed = new Discord.EmbedBuilder();
					logEmbed.setAuthor({
						name: `${interaction.user.username}#${interaction.user.discriminator} (${interaction.user.id})`,
						iconURL: interaction.user.displayAvatarURL()
					});
					logEmbed.setDescription(`**Banned:** ${member.user.username}#${member.user.discriminator} (${member.user.id})!\n**Reason:** ${banReason}`);
					logEmbed.setThumbnail(member.user.displayAvatarURL());

					interaction.guild.channels.cache.get(arcanusGuild.modLogChannel.toString()).send({ embeds: [logEmbed] });
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