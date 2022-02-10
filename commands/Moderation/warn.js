const Discord = require('discord.js');
const EmbedResponse = require('../../src/system/responses/EmbedResponse');

module.exports = {
	name: 'warn',
	category: 'Moderation',
	description: 'Warn an user',
	usage: '<user> <description>',
	permission: '',
	guildOnly: true,
	adminOnly: true,
	async execute(message, commandArguments) {
		const response = new EmbedResponse();
		response.setType('WARNING');
		if (commandArguments.length >= 2) {
			const memberResolvable = commandArguments.shift().replace(/<|>|@|!/g, '');
			try {
				const member = await message.guild.members.fetch(memberResolvable);
				const warningDescription = commandArguments.join(' ');
				const arcanusGuild = await message.client.arcanusClient.guilds.fetch(message.guild.id);
				await arcanusGuild.warnings.create(member.id, message.author.id, warningDescription);
				if (message.guild.channels.cache.has(arcanusGuild.modLogChannel.toString())) {
					const logEmbed = new Discord.MessageEmbed();
					logEmbed.setAuthor(`${message.author.username}#${message.author.discriminator} (${message.author.id})`, message.author.avatarURL());
					logEmbed.setDescription(`**Warned:** ${member.user.username}#${member.user.discriminator} (${member.user.id})!\n**Reason:** ${warningDescription}`);
					logEmbed.setThumbnail(member.user.avatarURL());

					message.guild.channels.cache.get(arcanusGuild.modLogChannel.toString()).send({ embeds: [logEmbed] });
				}
				response.setType('SUCCESS')
				response.setTitle('Warned!');
				response.setText(`Warned user \`${member.user.username}\` for \`${warningDescription}\``);
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