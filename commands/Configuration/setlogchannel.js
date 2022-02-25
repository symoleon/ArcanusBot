const EmbedResponse = require('../../src/system/responses/EmbedResponse');

module.exports = {
    name: 'setlogchannel',
    category: 'Configuration',
    description: 'Set channel for receiving logs',
    usage: '<Channel>',
    permissions: '',
    guildOnly: true,
    adminOnly: true,
    async execute(message, commandArguments) {
        const response = new EmbedResponse();
        response.setType('WARNING');
        if (commandArguments.length >= 1) {
            const channelResolvable = commandArguments.shift().replace(/<|>|#|!/g, '');
            try {
                const channel = await message.guild.channels.fetch(channelResolvable);
                const arcanusGuild = await message.client.arcanusClient.guilds.fetch(message.guild.id.toString());
                await arcanusGuild.setModLogChannel(channel.id.toString());
                response.setType('SUCCESS');
                response.setTitle('Succesfully updated!');
                response.setText(`Log channel has been set to <#${channel.id}>.`);
            } catch (error) {
                if (error.code == 10003) {
                    response.setTitle('Unknown channel');
                    response.setText(`I can't find channel with id \`${channelResolvable}\`.`);
                } else {
                    throw error;
                }
            }
        } else {
            response.setTitle('Not enough arguments!');
			response.setText(`Provide additional arguments or use \`help ${this.name}\` command.`);
        }
        return response;
    }
}