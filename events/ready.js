module.exports = {
	name: 'ready',
	once: true,
	async execute(loggedClient, config, client) {
		console.log(`Logged as: ${client.user.tag}`);
		
		const connected = await client.arcanusClient.Connect();
		if (connected) console.log('Connected to database');

		config.botMention = `<@${client.user.id}>`;
		config.botMentionWithExclamationMark = `<@!${client.user.id}>`;
	},
};