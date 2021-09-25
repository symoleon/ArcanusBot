const BaseResponse = require('../../src/system/responses/BaseResponse');

module.exports = {
	name: 'ping',
	category: 'Utility',
	description: 'Ping!',
	usage: '',
	permission: '',
	guildOnly: false,
	adminOnly: false,
	execute(message) {
		return new BaseResponse(`Pong! ${message.client.ws.ping}ms`);
	},
};