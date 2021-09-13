module.exports = {
	name: 'ready',
	once: true,
	execute(loggedClient, config, client) {
		console.log(`Logged as: ${client.user.tag}`);

		config.botMention = `<@${client.user.id}>`;
		config.botMentionWithExclamationMark = `<@!${client.user.id}>`;
	},
};