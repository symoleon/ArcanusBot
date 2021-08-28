const Discord = require('discord.js');

module.exports = {
	name: 'tenSeconds',
	once: false,
	async execute(config, client) {
		try {
			const expiredMutes = await client.arcanusClient.getExpiredMutes();
			expiredMutes.forEach(async mute => {
				const arcanusGuild = await client.arcanusClient.guilds.fetch(mute.guild_id);
				await arcanusGuild.mutesManager.delete(mute.id);
				try {
					const guild = await client.guilds.fetch(arcanusGuild.id);
					if (guild.channels.cache.has(arcanusGuild.mod_log_channel.toString())) {
						const user = await client.users.fetch(mute.user_id.toString());
						const logEmbed = new Discord.MessageEmbed();
						logEmbed.setAuthor(`${client.user.username}#${client.user.discriminator} (${client.user.id})`, client.user.avatarURL());
						logEmbed.setDescription(`**Unmuted:** ${user.username}#${user.discriminator} (${user.id})\n**Reason:** Mute expired!`);
						logEmbed.setThumbnail(user.avatarURL());

						guild.channels.cache.get(arcanusGuild.mod_log_channel.toString()).send(logEmbed);
					}
				} catch (error) {
					console.error(error);
				}
			});
		} catch (error) {
			if (error.code != 404) {
				console.error(error);
			}
		}

	},
};