const { safeSearch, safeResults } = require('./search');
const { Command } = require('discord.js-commando');
const config = require('../../data/config');

class Dropout extends Command {
    constructor(client) {
        super(client, {
            name: 'dropout',
            aliases: ['gabu'],
            group: 'booru',
            memberName: 'dropout',
            description: 'Searches for a picture tagged gabriel_dropout on safebooru.',
            throttling: {
                usages: 1,
                duration: 10
            }
        });
    }

    async run(message, args) {
        if (config.search.indexOf(message.channel.id) === -1) return message.reply(`this command only works in search enabled channels.`);
        safeSearch(('gabriel_dropout ' + args).replace('+','%2B').replace(' ', '+'))
            .then(result => safeResults(result, message), err => {
                console.log(err);
            });
    }
}

module.exports = Dropout;
