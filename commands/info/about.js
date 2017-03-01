const { RichEmbed } = require('discord.js');
const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');

class About extends Command {
    constructor(client) {
        super(client, {
            name: 'about',
            group: 'info',
            memberName: 'about',
            description: 'Displays information about the bot.',
            throttling: {
                usages: 1,
                duration: 10
            }
        });
    }

    async run(msg) {
        return msg.embed(new RichEmbed()
                .setTitle(`__**Cassandra v2.0 (QASI)**__`)
                .setFooter(`requested by ${msg.author.username}`, msg.author.avatarURL)
                .setDescription(stripIndents`
                    Cassandra v2.0, code name 'QASI', is a complete rewrite of cassandra.js.
                    
                    Cassie was a simple discord.js bot used for administration / image search.
                    
                    Now, it harnesses the power of discord.js-commando to make it easier to
                    use, maintain, and update.

                    [qasi on github](https://github.com/gloss-water/qasi)

                    [Discord.js](https://github.com/hydrabolt/discord.js)
                    [Commando](https://github.com/Gawdl3y/discord.js-commando)
                    [Commando bot](https://github.com/WeebDev/Commando)
                `)
                .setImage(this.client.user.displayAvatarURL)
                .setColor(8700043)
        );
    }
}

module.exports = About;
