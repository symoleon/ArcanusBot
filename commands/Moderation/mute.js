const Discord = require('discord.js');
const EmbedResponse = require('../../src/system/responses/EmbedResponse');

module.exports = {
	name: 'mute',
	category: 'Moderation',
	description: 'Mute an user',
	usage: '<User> <Time> <Description>',
	permission: '',
	guildOnly: true,
	adminOnly: true,
	async execute(interaction) {
		const response = new EmbedResponse();
		response.setType('WARNING');
		if (interaction.options.data.length >= 3) {
			try {
				const member = interaction.options.getMember('user');
				const providedDuration = interaction.options.getString('duration');
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
					const muteDescription = interaction.options.getString('description');
					const arcanusGuild = await interaction.client.arcanusClient.guilds.fetch(interaction.guild.id);
					// const arcanusGuildMember = await message.client.arcanusClient.getGuildMember(arcanusGuild, member.id);
					if (!member.isCommunicationDisabled()) {
						// await arcanusGuild.mutesManager.mute(arcanusGuildMember, interaction.user.id, muteDescription, durationInSeconds);
						// const role = await message.guild.roles.fetch(arcanusGuild.mute_role_id.toString());
						// await member.roles.add(role);
						await member.timeout(durationInSeconds*1000, muteDescription);
						if (interaction.guild.channels.cache.has(arcanusGuild.modLogChannel.toString())) {
							const logEmbed = new Discord.EmbedBuilder();
							logEmbed.setAuthor({
								name: `${interaction.user.username}#${interaction.user.discriminator} (${interaction.user.id})`,
								iconURL: interaction.user.displayAvatarURL(), 
							});
							logEmbed.setDescription(`**Muted:** ${member.user.username}#${member.user.discriminator} (${member.user.id})!\n**Reason:** ${muteDescription}`);
							logEmbed.setThumbnail(member.user.displayAvatarURL());
							logEmbed.setFooter({
								text: `Duration: ${durationReadable}`,
							});
							interaction.guild.channels.cache.get(arcanusGuild.modLogChannel.toString()).send({ embeds: [logEmbed] });
						}
						response.setType('SUCCESS');
						response.setTitle('Muted!');
						response.setText(`Muted user \`${member.user.username}\` for \`${muteDescription}\`\nDuration: \`${durationReadable}\``);
					} else {
						response.setTitle('Already muted!');
						response.setText(`User \`${member.user.username}\` is already muted!`);
					}
				} else {
					response.setTitle('Invalid duration!');
					response.setText(`Provided duration \`${providedDuration}\` is not valid!`);
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