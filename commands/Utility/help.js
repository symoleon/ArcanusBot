const EmbedResponse = require('./../../src/system/responses/EmbedResponse');
const Discord = require('discord.js');
const config = require('../../config.json');
module.exports = {
	name: 'help',
	category: 'Utility',
	description: 'Send a help message about all or only one command.',
	usage: '[command name]',
	permissions: '',
	ephemeral: true,
	guildOnly: false,
	adminOnly: false,
	execute(interaction) {
		const response = new EmbedResponse();
		const { commands } = interaction.client;

		if (!interaction.options.data.length) {
			response.setTitle('List of commands');
			response.setText(`To run command use slash commands! We won't support old message commands, sorry.`);
			const commandsStrings = new Discord.Collection();
			commands.forEach((value, key) => {
				if (!commandsStrings.has(value.category)) {
					commandsStrings.set(value.category, key);
				} else {
					commandsStrings.set(value.category, commandsStrings.get(value.category) + '\n' + key);
				}
			});
			commandsStrings.forEach((value, key) => {
				response.addField({ name: key, value: value, inline: true });
			});
		} else if (commands.has(interaction.options.getString('command_name'))) {
			const command = commands.get(interaction.options.getString('command_name'));
			response.setTitle(`Help of the \`${command.name}\` command`);
			response.setText(`
			Description: ${command.description}
			Usage: ${command.name} ${command.usage}`);
		} else {
			response.setType('WARNING');
			response.setTitle('No command with that name!');
			response.setText('Please check commands using `help` without parameters or provide correct command name.');
		}

		return response;
	},
};