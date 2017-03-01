const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');

class Yuri extends Command {
    constructor(client) {
        super(client, {
            name: 'yuri',
            group: 'misc',
            memberName: 'yuri',
            description: 'Displays a very important message.',
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
                hey
            `
        });
    }
}

module.exports = Yuri;
