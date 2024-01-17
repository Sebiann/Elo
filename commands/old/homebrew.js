const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "homebrew",
	aliases: ["hb", "hometoothebrew"],
	description: "Homebrew",
	get usage() { return `${process.env.PREFIX}${this.name} <command>`; },
	perms: ["SEND_MESSAGES"],
	execute(message, args) {
		let hbargs = args.shift();
		let hbvartypes = message.guild.me.client.homebrew.filter(hbvartypes => hbvartypes.types && hbvartypes.types.includes(hbargs));

		if (hbvartypes.size) {

			let typeEmbed = new MessageEmbed()
				.setColor(message.member.displayHexColor)
				.setTitle(hbargs.toUpperCase() + "s")
				.setDescription("List")
				.setTimestamp()
				.setFooter(`Requested by ${message.author.username}`);

			let embedFields = hbvartypes.map(hb => {
				return {
					name: hb.name,
					value: hb.description,
					inline: false
				};
			});

			typeEmbed.addFields(embedFields);

			return message.channel.send(typeEmbed);

		}

		let hbvar = message.guild.me.client.homebrew.get(hbargs)
            || message.guild.me.client.homebrew.find(hbvar => hbvar.aliases && hbvar.aliases.includes(hbargs));

		if (hbvar) {
			message.channel.send(hbvar.file);
		} else {
			message.channel.send("I dont know that Homebrew Page");
		}
	}
};
