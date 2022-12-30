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
	async execute(interaction) {
		const response = new EmbedResponse();
		response.setType('WARNING');
		if (interaction.options.data.length >= 2) {
			const warningId = interaction.options.getString('warning_id');
			try {
				const member = interaction.options.getMember('user');
				const arcanusGuild = await interaction.client.arcanusClient.guilds.fetch(interaction.guild.id);
				const warning = await arcanusGuild.warnings.fetch(warningId);
				await warning.delete(warningId);
				if (interaction.guild.channels.cache.has(arcanusGuild.modLogChannel.toString())) {
					const logEmbed = new Discord.EmbedBuilder();
					logEmbed.setAuthor({
						name :`${interaction.user.username}#${interaction.user.discriminator} (${interaction.user.id})`,
						iconURL: interaction.user.displayAvatarURL()
					});
					logEmbed.setDescription(`**Deleted warning:** ${warning.reason} (${warning.id})\n**From:** ${member.user.username}#${member.user.discriminator} (${member.user.id})!`);
					logEmbed.setThumbnail(member.user.displayAvatarURL());

					interaction.guild.channels.cache.get(arcanusGuild.modLogChannel.toString()).send({ embeds: [logEmbed] });
				}
				response.setType('SUCCESS');
				response.setTitle('Warning deleted!');
				response.setText(`Warning with ID \`${warningId}\` has been deleted!`);
			} catch (error) {
				if (error.code == 10013) {
					response.setTitle('Invalid user!');
					response.setText(`I can't find that user.`);
				} else if (error.code == 1002) {
					response.setTitle('Invalid warning ID!');
					response.setText(`I can't find warning with id: \`${warningId}\``);
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