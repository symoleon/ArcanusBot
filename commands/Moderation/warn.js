const Discord = require('discord.js');
module.exports = {
	name: 'warn',
	category: 'Moderation',
	description: 'Warn an user',
	usage: '<user> <description>',
	permission: '',
	async execute(message, commandArguments) {
		const messageEmbed = new Discord.MessageEmbed();
		if (commandArguments.length >= 2) {
			const memberResolvable = commandArguments.shift().replace(/<|>|@|!/g, '');
			const member = await message.guild.members.fetch(memberResolvable);
			if (member != null) {
				const warningDescription = commandArguments.join(' ');
				const arcanusGuild = await message.client.arcanusClient.getGuild(message.guild.id);
				const arcanusGuildMember = await message.client.arcanusClient.getGuildMember(arcanusGuild, member.id);
				await arcanusGuildMember.warningsManager.warn(message.author.id, warningDescription);
				messageEmbed.setTitle('Warned!');
				messageEmbed.setDescription(`Warned user \`${member.user.username}\` for \`${warningDescription}\``);
			} else {
				messageEmbed.setTitle('Invalid user!');
				messageEmbed.setDescription(`I can't find user with \`${memberResolvable}\` name or ID.`);
			}
		} else {
			messageEmbed.setTitle('Not enough arguments!');
			messageEmbed.setDescription('Provide additional arguments or use `help warn` command.');
		}
		message.channel.send(messageEmbed);
	},
};