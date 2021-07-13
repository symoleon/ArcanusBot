module.exports = {
	name: 'message',
	once: false,
	execute(message, config, client) {
		if (!(message.content.startsWith(config.botMention) || message.content.startsWith(config.prefix) || message.content.startsWith(config.botMentionWithExclamationMark)) || message.author.bot) return;

		const commandContent = message.content.replace(config.botMention, '').replace(config.botMentionWithExclamationMark, '').replace(config.prefix, '').trim();
		const commandArguments = commandContent.split(/ +/);
		const command = commandArguments.shift();

		if (!client.commands.has(command)) return;

		try {
			client.commands.get(command).execute(message, commandArguments);
		} catch (error) {
			console.log(error);
			message.channel.send('There was an error during execution of this command!');
		}
	},
};