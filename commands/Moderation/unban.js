const Discord = require('discord.js');

module.exports = {
	name: 'unban',
	category: 'Moderation',
	description: 'Unban user for given reason',
	usage: '<User> <Reason>',
	permissions: 'BAN_MEMBER',
	guildOnly: true,
	adminOnly: true,
	async execute(message, commandArguments) {
		const messageEmbed = new Discord.MessageEmbed();
		if (commandArguments.length >= 2) {
			const userResolvable = commandArguments.shift().replace(/<|>|@|!/g, '');
			try {
				const user = await message.client.users.fetch(userResolvable);
				const unbanReason = commandArguments.join(' ');
				await message.guild.members.unban(user, unbanReason);
				messageEmbed.setTitle('Unbanned!');
				messageEmbed.setDescription(`Unbanned user \`${user.username}\` for \`${unbanReason}\``);
			} catch (error) {
				if (error.code == 10013) {
					messageEmbed.setTitle('Invalid user!');
					messageEmbed.setDescription(`I can't find user with \`${userResolvable}\` name or ID.`);
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