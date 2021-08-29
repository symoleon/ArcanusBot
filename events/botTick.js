const Discord = require('discord.js');

module.exports = {
	name: 'botTick',
	once: false,
	async execute(config, client) {
		try {
			const expiredMutes = await client.arcanusClient.getExpiredMutes();
			expiredMutes.forEach(async mute => {
				const arcanusGuild = await client.arcanusClient.guilds.fetch(mute.guild_id);
				await arcanusGuild.mutesManager.delete(mute.id);
				try {
					const guild = await client.guilds.fetch(arcanusGuild.id);
					const member = await guild.members.fetch(mute.user_id.toString());
					await member.roles.remove(arcanusGuild.mute_role_id.toString());
					if (guild.channels.cache.has(arcanusGuild.mod_log_channel.toString())) {
						const logEmbed = new Discord.MessageEmbed();
						logEmbed.setAuthor(`${client.user.username}#${client.user.discriminator} (${client.user.id})`, client.user.avatarURL());
						logEmbed.setDescription(`**Unmuted:** ${member.user.username}#${member.user.discriminator} (${member.user.id})\n**Reason:** Mute expired!`);
						logEmbed.setThumbnail(member.user.avatarURL());

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