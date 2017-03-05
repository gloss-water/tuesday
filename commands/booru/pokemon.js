const { search, sendResults } = require('./search');
const { Command } = require('discord.js-commando');
const config = require('../../data/config');

class Pokemon extends Command {
    constructor(client) {
        super(client, {
            name: 'pokemon',
            aliases: ['pk'],
            group: 'booru',
            memberName: 'pokemon',
            description: 'Searches for a picture tagged pokemon on gelbooru.',
            throttling: {
                usages: 1,
                duration: 10
            }
        });
    }

    async run(message, args) {
        if (config.search.indexOf(message.channel.id) === -1) return message.reply(`this command only works in search enabled channels.`);
        search('pokemon', args.replace('+','%2B').replace(' ', '+'))
            .then(result => sendResults(result, message), err => {
                console.log(err);
            });
    }
}

module.exports = Pokemon;
