const winston = require('winston');
const fs = require('fs');

const { RichEmbed } = require('discord.js');
const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');
const config = require('../../data/config');

// todo: Reimplement with db later, just use json for now
const loadWelcomeData = () => {
    return require('../../data/welcomes');
}

class Welcome extends Command {
    constructor(client) {
        super(client, {
            name: 'welcome',
            group: 'membership',
            memberName: 'welcome',
            description: 'Welcomes new members to the server.',
            throttling: {
                usages: 1,
                duration: 10
            }
        });
    }

    async run(message) {
        // todo: See if we can PR 'dmOnly' functionality to commando client options?
        if (message.channel.type !== 'dm') return;

        const welcomes = loadWelcomeData();
        if (welcomes[message.author.id] === undefined) {
            winston.info(this.client.channels);
            this.client.channels.get(config.home).sendMessage(`${message.author} has requested a welcome.`).catch();
            this.client.guilds.get(config.guild).defaultChannel.sendMessage(`Welcome to the Offishal Nyanners server, ${message.author}! Have a nice time!`).catch();
            welcomes[message.author.id] = true;
            fs.writeFile(__dirname + '/../../data/welcomes.json', JSON.stringify(welcomes), 'utf8', err => {
                if (err) return console.log('couldnt write to file alert alert alert');
            });
            return message.reply(`okay, should be done :)`);
        } else {
            return message.reply('sorry, I only do welcome messages once per member :(');
        }
    }
}

module.exports = Welcome;
