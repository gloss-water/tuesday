const { safeSearch, safeResults } = require('./search');
const { Command } = require('discord.js-commando');
const config = require('../../data/config');

class ColonThree extends Command {
    constructor(client) {
        super(client, {
            name: ':3',
            aliases: ['colonthree'],
            group: 'booru',
            memberName: ':3',
            description: 'Searches for a picture tagged :3 on gelbooru.',
            throttling: {
                usages: 1,
                duration: 10
            }
        });
    }

    async run(message, args) {
        if (config.search.indexOf(message.channel.id) === -1) return message.reply(`this command only works in search enabled channels.`);
        safeSearch((':3 ' + args).replace('+','%2B').replace(' ', '+'))
            .then(result => safeResults(result, message), err => {
                console.log(err);
            });
    }
}

module.exports = ColonThree;
