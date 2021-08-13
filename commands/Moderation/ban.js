const Discord = require('discord.js');

module.exports = {
	name: 'ban',
	category: 'Moderation',
	description: 'Ban user for give reason',
	usage: '<User> <Reason>',
	permissions: 'BAN_MEMBER',
	guildOnly: true,
	adminOnly: true,
	async execute(message, commandArguments) {
		const messageEmbed = new Discord.MessageEmbed();
		if (commandArguments.length >= 2) {
			const memberResolvable = commandArguments.shift().replace(/<|>|@|!/g, '');
			try {
				const member = await message.guild.members.fetch(memberResolvable);
				const banReason = commandArguments.join(' ');
				await member.ban({ reason: banReason });
				messageEmbed.setTitle('Banned!');
				messageEmbed.setDescription(`Banned user \`${member.user.username}\` for \`${banReason}\``);
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