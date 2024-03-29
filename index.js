const dotenv = require('dotenv');
dotenv.config();
const fs = require('fs');
const Discord = require('discord.js');
const { ArcanusClient } = require('arcanusjs');
const config = require('./config.json');

const intents = [
	Discord.GatewayIntentBits.Guilds,
	Discord.GatewayIntentBits.GuildMembers,
	Discord.GatewayIntentBits.GuildBans,
	Discord.GatewayIntentBits.GuildMembers,
	Discord.GatewayIntentBits.GuildMessages,
	Discord.GatewayIntentBits.GuildMessageReactions,
	Discord.GatewayIntentBits.DirectMessages,
	Discord.GatewayIntentBits.DirectMessageReactions,
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

process.on('SIGTERM', async code => {
	try {
		await client.arcanusClient.Close();
		console.log(`\nSuccessfuly closed db connection and exited with code: ${code}`);
		process.exit();
	} catch (error) {
		console.log(error);
	}
});
process.on('SIGINT', () => {
	process.emit('SIGTERM', 'SIGINT');
})

client.login(process.env.TOKEN);