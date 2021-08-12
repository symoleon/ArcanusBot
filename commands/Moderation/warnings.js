const Discord = require('discord.js');

module.exports = {
	name: 'warnings',
	category: 'Moderation',
	description: 'List all warnings of you or given person',
	usage: '[user]',
	permissions: '',
	async execute(message, commandArguments) {
		const messageEmbed = new Discord.MessageEmbed();
		let member = null;
		messageEmbed.setTitle('List of warnings');
		if (commandArguments[0] != undefined) {
			const memberResolvable = commandArguments.shift().replace(/<|>|@|!/g, '');
			member = await message.guild.members.fetch(memberResolvable);
		}
		if (member != null) {
			member = member.user;
		} else {
			member = message.author;
		}

		const arcanusGuild = await message.client.arcanusClient.getGuild(message.guild.id);
		const arcanusGuildMember = await message.client.arcanusClient.getGuildMember(arcanusGuild, member.id);
		if (arcanusGuildMember.warningsManager.warningsIds.length == 0) {
			messageEmbed.setDescription(`User \`${member.username}\` don't have any warnings!`);
		} else {
			messageEmbed.setDescription(`All \`${member.username}\`'s warnings`);
			for (const warningId of arcanusGuildMember.warningsManager.warningsIds) {
				const warning = await arcanusGuildMember.warningsManager.fetch(warningId);
				messageEmbed.addField(`ID: ${warning.id}`, `${warning.description}\nWarned by <@${warning.mod_id}>`);
			}
		}

		message.channel.send(messageEmbed);
	},
};