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
                usages: 2,
                duration: 3
            }
        });
    }

    async run(msg) {
        return msg.embed({
            color: 8700043,
            description: stripIndents`
                __**Cassandra v2.0 (QASI)**__
                Cassandra v2.0, code name QASI, is a complete rewrite of the cassandra.js.
                Cassie was a simple discord.js bot used for administration / image search.
                Now, it harnesses the power of discord.js-commando to make it easier to
                use, maintain, and update.

                [QASI Github](https://github.com/gloss-water/qasi)

                [Discord.js](https://github.com/hydrabolt/discord.js)
                [Commando](https://github.com/Gawdl3y/discord.js-commando)
                [Commando bot](https://github.com/WeebDev/Commando)
            `
        });
    }
}

module.exports = About;
