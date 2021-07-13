module.exports = {
	name: 'ping',
	category: 'Utility',
	descritpion: 'Ping!',
	usage: '',
	permission: '',
	execute(message) {
		message.reply(`pong! ${message.client.ws.ping}ms`);
	},
};