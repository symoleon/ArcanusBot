const EmbedResponse = require('../../src/system/responses/EmbedResponse');

module.exports = {
    name: 'setlogchannel',
    category: 'Configuration',
    description: 'Set channel for receiving logs',
    usage: '<Channel>',
    permissions: '',
    guildOnly: true,
    adminOnly: true,
    async execute(interaction) {
        const response = new EmbedResponse();
        response.setType('WARNING');
        if (interaction.options.data.length >= 1) {
            try {
                const channel = interaction.options.getChannel('channel');
                const arcanusGuild = await interaction.client.arcanusClient.guilds.fetch(interaction.guild.id.toString());
                if (channel.isTextBased() == false) {
                    response.setTitle('Invalid channel!');
                    response.setText(`Channel \`${channel.name}\` is not text based.`);
                    return response;
                }
                await arcanusGuild.setModLogChannel(channel.id.toString());
                response.setType('SUCCESS');
                response.setTitle('Succesfully updated!');
                response.setText(`Log channel has been set to <#${channel.id}>.`);
            } catch (error) {
                if (error.code == 10003) {
                    response.setTitle('Unknown channel');
                    response.setText(`I can't find that channel.`);
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