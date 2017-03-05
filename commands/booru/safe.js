const { safeSearch, safeResults } = require('./search');
const { Command } = require('discord.js-commando');
const config = require('../../data/config');

class Safe extends Command {
    constructor(client) {
        super(client, {
            name: 'safe',
            aliases: ['safebooru'],
            group: 'booru',
            memberName: 'safe',
            description: 'Searches safebooru for a picture with the passed tags or a random picture.',
            throttling: {
                usages: 1,
                duration: 10
            }
        });
    }

    async run(message, args) {
        if (config.search.indexOf(message.channel.id) === -1) return message.reply(`this command only works in search enabled channels.`);
        safeSearch(args.replace('+','%2B').replace(' ', '+'))
            .then(result => safeResults(result, message), err => {
                console.log(err);
            });
    }
}

module.exports = Safe;
