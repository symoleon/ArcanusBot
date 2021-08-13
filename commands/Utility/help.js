const Discord = require('discord.js');
const config = require('../../config.json');
module.exports = {
	name: 'help',
	category: 'Utility',
	description: 'Send a help message about all or only one command.',
	usage: '[command name]',
	permissions: '',
	guildOnly: false,
	adminOnly: false,
	execute(message, commandArguments) {
		const embed = new Discord.MessageEmbed();
		const { commands } = message.client;

		if (!commandArguments.length) {
			embed.title = 'List of commands';
			embed.description = `To run command use server prefix with is \`${config.prefix}\` or just mention me!`;
			const commandsStrings = new Discord.Collection();
			commands.forEach((value, key) => {
				if (!commandsStrings.has(value.category)) {
					commandsStrings.set(value.category, key);
				} else {
					commandsStrings.set(value.category, commandsStrings.get(value.category) + '\n' + key);
				}
			});
			commandsStrings.forEach((value, key) => {
				embed.fields.push({ 'name': key, 'value': value, 'inline': true });
			});
		} else if (commands.has(commandArguments[0])) {
			const command = commands.get(commandArguments[0]);
			embed.title = `Help of the \`${command.name}\` command`;
			embed.description = `
			Description: ${command.description}
			Usage: ${command.name} ${command.usage}`;
		} else {
			embed.title = 'No command with that name!';
			embed.description = 'Please check commands using `help` without parameters or provide correct command name.';
		}

		message.channel.send(embed);
	},
};