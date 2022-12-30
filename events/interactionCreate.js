const Discord = require('discord.js');
const EmbedResponse = require('../src/system/responses/EmbedResponse');

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction, config, client) {
        if (!interaction.isChatInputCommand()) return;
        
        if (!client.commands.has(interaction.commandName)) return;

        const command = client.commands.get(interaction.commandName);

        try {
            if (command.adminOnly == true) {
                const arcanusGuild = await client.arcanusClient.guilds.fetch(interaction.guild.id);
                let hasAdminRole = false;
                for (const element of interaction.member.roles.cache) {
                    const isAdmin = await arcanusGuild.isAdmin(element[1].id);
                    if (isAdmin) {
                        hasAdminRole = true;
                        break;
                    }
                }
                if (!hasAdminRole) {
                    const embed = new Discord.EmbedBuilder();
                    embed.setTitle('Insufficient permissions!');
                    embed.setDescription('You don\'t have permissions to execute this command!');
                    interaction.reply({ embeds: [embed] });
                    return;
                }
            }
            const response = await command.execute(interaction);
            if (Array.isArray(response)) {
                response.forEach(responseItem => {
                    interaction.reply({...responseItem.makeMessageObject(), ephemeral: command.ephemeral});
                });
            } else {
                interaction.reply({...response.makeMessageObject(), ephemeral: command.ephemeral});
            }
        } catch (error) {
            const response = new EmbedResponse();
            response.setType('ERROR');
			if (error.code == 50013) {
				response.setTitle('No permissions');
				response.setText('I can\'t do that! I\'m lack permissions!')
			} else {
				console.log(error);
				response.setTitle('Error');
				response.setText('There was an error during execution of this command!');
			}
            interaction.reply({ embeds: [response.makeMessageObject()] });
        }

    },
}