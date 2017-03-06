const { safeSearch, safeResults } = require('./search');
const { Command } = require('discord.js-commando');
const config = require('../../data/config');

class Yuri extends Command {
    constructor(client) {
        super(client, {
            name: 'yuri',
            aliases: ['yoi'],
            group: 'booru',
            memberName: 'yuri',
            description: 'Searches for a picture tagged yuri!!!_on_ice on safebooru.',
            throttling: {
                usages: 1,
                duration: 10
            }
        });
    }

    async run(message, args) {
        if (config.search.indexOf(message.channel.id) === -1) return message.reply(`this command only works in search enabled channels.`);
        safeSearch(('yuri!!!_on_ice ' + args).replace('+','%2B').replace(' ', '+'))
            .then(result => safeResults(result, message), err => {
                console.log(err);
            });
    }
}

module.exports = Yuri;
