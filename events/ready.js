module.exports = {
	name: 'ready',
	once: true,
	async execute(loggedClient, config, client) {
		const connected = await client.arcanusClient.Connect();
		if (connected) console.log('Connected to database');
		console.log(`Logged as: ${client.user.tag}`);

		config.botMention = `<@${client.user.id}>`;
		config.botMentionWithExclamationMark = `<@!${client.user.id}>`;
	},
};