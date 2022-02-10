const dotenv = require('dotenv');
dotenv.config();
const fs = require('fs');
const Discord = require('discord.js');
const { ArcanusClient } = require('arcanusjs');
const config = require('./config.json');

const intents = [
	Discord.Intents.FLAGS.GUILDS,
	Discord.Intents.FLAGS.GUILD_MEMBERS,
	Discord.Intents.FLAGS.GUILD_BANS,
	Discord.Intents.FLAGS.GUILD_PRESENCES,
	Discord.Intents.FLAGS.GUILD_MESSAGES,
	Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
	Discord.Intents.FLAGS.DIRECT_MESSAGES,
	Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
];

const client = new Discord.Client({ intents: intents });
client.arcanusClient = new ArcanusClient(process.env.ARCANUS_LOGIN, process.env.ARCANUS_PASSWORD, process.env.ARCANUS_DB);
client.commands = new Discord.Collection();

const commandCategories = fs.readdirSync('./commands', { withFileTypes: true }).filter(file => file.isDirectory());
for (const category of commandCategories) {
	const commandFiles = fs.readdirSync(`./commands/${category.name}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${category.name}/${file}`);
		client.commands.set(command.name, command);
	}
}

const uncategorizedCommands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of uncategorizedCommands) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, config, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, config, client));
	}
}

setInterval(() => {
	client.emit('botTick');
}, 5000);

client.login(process.env.TOKEN);