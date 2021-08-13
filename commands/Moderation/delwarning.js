const Discord = require('discord.js');

module.exports = {
	name: 'delwarning',
	category: 'Moderation',
	description: 'Delete user\'s warning',
	usage: '<user> <warningId>',
	permissions: '',
	async execute(message, commandArguments) {
		const messageEmbed = new Discord.MessageEmbed();
		if (commandArguments.length >= 2) {
			const memberResolvable = commandArguments.shift().replace(/<|>|@|!/g, '');
			try {
				const member = await message.guild.members.fetch(memberResolvable);
				const warningId = commandArguments.shift();
				const arcanusGuild = await message.client.arcanusClient.getGuild(message.guild.id);
				const arcanusGuildMember = await message.client.arcanusClient.getGuildMember(arcanusGuild, member.id);
				if (arcanusGuildMember.warningsManager.warningsIds.indexOf(warningId) != -1) {
					await arcanusGuildMember.warningsManager.delete(warningId);
					messageEmbed.setTitle('Warning deleted!');
					messageEmbed.setDescription(`Warning with ID \`${warningId}\` has been deleted!`);
				} else {
					messageEmbed.setTitle('Invalid warning ID!');
					messageEmbed.setDescription(`User \`${member.user.id}\` don't have warn with id \`${warningId}\``);
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