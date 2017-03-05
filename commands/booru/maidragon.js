const { search, sendResults } = require('./search');
const { Command } = require('discord.js-commando');
const config = require('../../data/config');

class Maidragon extends Command {
    constructor(client) {
        super(client, {
            name: 'maidragon',
            aliases: ['md'],
            group: 'booru',
            memberName: 'maidraon',
            description: 'Searches for a picture tagged kobayashi-san_chi_no_maidragon on gelbooru.',
            throttling: {
                usages: 1,
                duration: 10
            }
        });
    }

    async run(message, args) {
        if (config.search.indexOf(message.channel.id) === -1) return message.reply(`this command only works in search enabled channels.`);
        search('kobayashi-san_chi_no_maidragon', args.replace('+','%2B').replace(' ', '+'))
            .then(result => sendResults(result, message), err => {
                console.log(err);
            });
    }
}

module.exports = Maidragon;
