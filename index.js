const fs = require("fs");

require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();

const commandDir = "./commands";
const triggerDir = "./triggers";
const homebrewDir = "./hb";

const commandFiles = fs.readdirSync(commandDir).filter(file => file.endsWith(".js"));
const triggerFiles = fs.readdirSync(triggerDir).filter(file => file.endsWith(".js"));
const homebrewFiles = fs.readdirSync(homebrewDir).filter(file => file.endsWith(".js"));

client.commands = new Discord.Collection();
client.homebrew = new Discord.Collection();

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

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({ activity: { name: "DnD", type: "PLAYING" } });
});

function handleMessage(message) {
    if (message.author.bot || message.channel.type === "dm") return;

    /**
     * Triggers
     */
    for (const trigger of client.triggers) {
        if (trigger.regex.test(message.content)) {
            if (checkPerms(message, trigger.perms)) {
                trigger.execute(message);
            }
            break;
        }
    }

    /**
     * Commands
     */
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
});

client.login(process.env.TOKEN);

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
}