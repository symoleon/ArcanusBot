const dotenv = require('dotenv');
dotenv.config();
const fs = require('fs');
const Discord = require('discord.js');
const Arcanus = require('nodearcanusapilib');
const config = require('./config.json');

const client = new Discord.Client();
client.arcanusClient = new Arcanus.APIClient('https://dev.symoleon.pl/arcanus/api', process.env.ARCANUS_TOKEN);
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

client.setInterval(() => {
	client.emit('botTick');
}, 5000);

client.login(process.env.TOKEN);