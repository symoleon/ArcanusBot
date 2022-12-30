const BaseResponse = require('../../src/system/responses/BaseResponse');

module.exports = {
	name: 'ping',
	category: 'Utility',
	description: 'Ping!',
	usage: '',
	permission: '',
	ephemeral: false,
	guildOnly: false,
	adminOnly: false,
	execute(interaction) {
		return new BaseResponse(`Pong! ${interaction.client.ws.ping}ms`);
	},
};