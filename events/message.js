const Discord = require('discord.js');

module.exports = {
	name: 'message',
	once: false,
	async execute(message, config, client) {
		if (!(message.content.startsWith(config.botMention) || message.content.startsWith(config.prefix) || message.content.startsWith(config.botMentionWithExclamationMark)) || message.author.bot) return;

		const commandContent = message.content.replace(config.botMention, '').replace(config.botMentionWithExclamationMark, '').replace(config.prefix, '').trim();
		const commandArguments = commandContent.split(/ +/);
		const command = commandArguments.shift();

		if (!client.commands.has(command)) return;

		if ((client.commands.get(command).guildOnly == true || client.commands.get(command).adminOnly == true) && (message.channel.type != 'text' && message.channel.type != 'news')) {
			const embed = new Discord.MessageEmbed();
			embed.setTitle('This command is available only in guilds!');
			embed.setDescription('To execute this command you must use it in guild\'s channel!');
			message.channel.send(embed);
			return;
		}

		try {
			if (client.commands.get(command).adminOnly == true) {
				const arcanusGuild = await client.arcanusClient.guilds.fetch(message.guild.id);
				if (!arcanusGuild.admins.some(role => {
					return message.member.roles.cache.has(role.toString());
				})) {
					const embed = new Discord.MessageEmbed();
					embed.setTitle('Insufficient permissions!');
					embed.setDescription('You don\'t have permissions to execute this command!');
					message.channel.send(embed);
					return;
				}
			}
			client.commands.get(command).execute(message, commandArguments);
		} catch (error) {
			console.log(error);
			message.channel.send('There was an error during execution of this command!');
		}
	},
};