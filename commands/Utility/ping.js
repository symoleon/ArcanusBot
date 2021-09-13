module.exports = {
	name: 'ping',
	category: 'Utility',
	description: 'Ping!',
	usage: '',
	permission: '',
	guildOnly: false,
	adminOnly: false,
	execute(message) {
		message.reply(`Pong! ${message.client.ws.ping}ms`);
	},
};