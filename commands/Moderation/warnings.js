const Discord = require('discord.js');
const EmbedResponse = require('../../src/system/responses/EmbedResponse');

module.exports = {
	name: 'warnings',
	category: 'Moderation',
	description: 'List all warnings of you or given person',
	usage: '[user]',
	permissions: '',
	guildOnly: true,
	adminOnly: false,
	async execute(message, commandArguments) {
		let response = new EmbedResponse();
		response.setTitle('List of warnings');
		let member = null;
		if (commandArguments[0] != undefined) {
			const memberResolvable = commandArguments.shift().replace(/<|>|@|!/g, '');
			member = await message.guild.members.fetch(memberResolvable);
		}
		if (member != null) {
			member = member.user;
		} else {
			member = message.author;
		}

		const arcanusGuild = await message.client.arcanusClient.guilds.fetch(message.guild.id);
		const warningsIds = await arcanusGuild.warnings.fetchMemberWarnings(member.id);
		if (warningsIds.length === 0) {
			response.setText(`User \`${member.username}\` don't have any warnings!`);
			response.setType('SUCCESS');
		} else {
			response.setText(`All \`${member.username}\`'s warnings`);
			for (const id of warningsIds) {
				const warning = await arcanusGuild.warnings.fetch(id);
				response.addField({ name: `ID: ${warning.id}`, value: `${warning.reason}\nWarned by <@${warning.modId}>`, inline: false });
			}
		}

		return response;
	},
};