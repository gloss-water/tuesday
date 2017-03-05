const { safeSearch, safeResults } = require('./search');
const { Command } = require('discord.js-commando');
const config = require('../../data/config');

class FFXIV extends Command {
    constructor(client) {
        super(client, {
            name: 'ffxiv',
            aliases: ['ff', '14'],
            group: 'booru',
            memberName: 'ffxiv',
            description: 'Searches for a picture tagged final_fantasy_xiv on safebooru.',
            throttling: {
                usages: 1,
                duration: 10
            }
        });
    }

    async run(message, args) {
        // If the channel id isn't in list of authorized channels, dont search
        if (config.search.indexOf(message.channel.id) === -1) return message.reply(`this command only works in search enabled channels.`);
        safeSearch(('final_fantasy_xiv ' + args).replace('+','%2B').replace(' ', '+'))
            .then(result => safeResults(result, message), err => {
                console.log(err);
            });
    }
}

module.exports = FFXIV;
