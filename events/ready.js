module.exports = {
	name: 'ready',
	once: true,
	execute(config, client) {
		console.log(`Logged as: ${client.user.tag}`);

		config.botMention = `<@${client.user.id}>`;
		config.botMentionWithExclamationMark = `<@!${client.user.id}>`;
	},
};