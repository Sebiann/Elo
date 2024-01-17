const fs = require("node:fs");
const path = require('node:path');

const config = require('./config.json');
// require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client({ intents: [Discord.GatewayIntentBits.Guilds] });

client.commands = new Discord.Collection();
client.homebrew = new Discord.Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(config.token);

// const commandDir = "./commands";
// const triggerDir = "./triggers";
// const homebrewDir = "./hb";

// const commandFiles = fs.readdirSync(commandDir).filter(file => file.endsWith(".js"));
// const triggerFiles = fs.readdirSync(triggerDir).filter(file => file.endsWith(".js"));
// const homebrewFiles = fs.readdirSync(homebrewDir).filter(file => file.endsWith(".js"));

/*
console.log("Loading commands: ");
for (const file of commandFiles) {
    const command = require(`${commandDir}/${file}`);
    client.commands.set(command.name, command);
    console.log(`  ${command.name}`);
}

client.triggers = [];
console.log("Loading triggers: ");
for (const file of triggerFiles) {
    const trigger = require(`${triggerDir}/${file}`);
    client.triggers.push(trigger);
    console.log(`  ${trigger.name}`);
}

console.log("Loading Homebrew Pages: ");
for (const file of homebrewFiles) {
    const homebrew = require(`${homebrewDir}/${file}`);
    client.homebrew.set(homebrew.name, homebrew);
    console.log(`  ${homebrew.name}`);
}
*/

/*
function handleMessage(message) {
    if (message.author.bot || message.channel.type === "dm") return;

    // Triggers

    for (const trigger of client.triggers) {
        if (trigger.regex.test(message.content)) {
            if (checkPerms(message, trigger.perms)) {
                trigger.execute(message);
            }
            break;
        }
    }

    // Commands

    if (!message.content.startsWith(process.env.PREFIX)) return;
    let args = message.content.substring(process.env.PREFIX.length).split(" ");
    let command = args.shift();

    try {
        let cmd = client.commands.get(command)
            || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));

        if (!cmd) {
            return message.channel.send("Not a real command");
        }

        if (checkPerms(message, cmd.perms)) {
            cmd.execute(message, args);
        }

    } catch (error) {
        console.error(error);
        message.channel.send("There was an error trying to execute that command!");
    }
}

client.on("message", handleMessage);
client.on("messageUpdate", async (_, newMsg) => {
    let messagesAfter = await newMsg.channel.messages.fetch({
        limit: 10,
        after: newMsg.id
    });
    let botMessage = messagesAfter.find(msg => msg.author.id === client.user.id);
    if (botMessage) botMessage.delete();

    handleMessage(newMsg);
}); */

/*
function checkPerms(message, perms) {
    let missingPerms = [];

    for (const perm of perms) {
        if (!message.guild.me.permissionsIn(message.channel).has(perm)) {
            missingPerms.push(perm);
        }
    }

    if (missingPerms.length > 0 && message.guild.me.permissionsIn(message.channel).has("SEND_MESSAGES")) {
        message.channel.send(`Missing the following Permissions: \`\`\`\n${missingPerms.join("\n")}\`\`\``);
    }
    
    return missingPerms.length === 0;
} */