// Dependencies
const { Client, SQLiteProvider } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const winston = require('winston');
const path = require('path');
const sqlite = require('sqlite');
const fs = require('fs');
const { stripIndents } = require('common-tags');

// Configuration
const config = require('./data/config');
const censorship = require('./data/censorship');
let home = '';
let welcome = {};

// Client set up
const qasi = new Client({
    owner: config.auth.ownerID,
    commandPrefix: '?'
});
qasi.setProvider(
    sqlite.open(path.join(__dirname + '/data', 'dbqasi.sqlite3'))
        .then(db => new SQLiteProvider(db))
);
qasi.registry.registerGroups([
    ['booru', 'Image Search']
]).registerDefaults().registerCommandsIn(path.join(__dirname, 'dev'));

// Event handlers
qasi
    .once('ready', () => {
        winston.info(`QASI initialized. Logged in as ${qasi.user.username}#${qasi.user.discriminator}.`);
        home = qasi.channels.get(config.home);
    })
    .on('disconnect', () => {
        winston.warn('QASI disconnected from Discord.')
    })
    .on('reconnecting', () => {
        winston.warn('QASI reconnecting to Discord.')
    })
    .on('error', winston.error)
    .on('warn', winston.warn)
    .on('messageDelete', async message => {
        home.sendEmbed(new RichEmbed()
            .setDescription(stripIndents`
                **Message from ${message.author} deleted in ${message.channel}.**
                ${message.content}
            `)
            .setColor(8700043)
        );
        console.log(message);
    });
qasi.login(config.auth.token);
