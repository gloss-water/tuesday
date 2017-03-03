// Dependencies
const { Client, SQLiteProvider } = require('discord.js-commando');
const winston = require('winston');
const path = require('path');
const sqlite = require('sqlite');
const { stripIndents } = require('common-tags');

// Configuration
const config = require('./data/config');
const censorship = require('./data/censorship');

// Client set up
const qasi = new Client({
    owner: config.auth.ownerID,
    commandPrefix: config.prefix
});
qasi.setProvider(
    sqlite.open(path.join(__dirname + '/data', 'dbqasi.sqlite3'))
        .then(db => new SQLiteProvider(db))
);
qasi.registry.registerGroups([
    ['admin', 'Administration'],
    ['info', 'Information'],
    ['misc', 'Miscellaneous']
]).registerDefaults().registerCommandsIn(path.join(__dirname, 'commands'));

// Utility methods (let's move these somewhere else soon)
const isExempt = async message => {
    let exempt = false;
    let member = message.member;
    if (!member) { // If we haven't cached the member yet, we need to grab it
        await qasi.fetchUser(message.author.id);
        member = await message.guild.fetchMember(message.author);
    }
    // Check every exemption to see if it exists;
    config.exemptions.every(ex => { if (member.roles.exists('name', ex)) exempt = true });
    return exempt;
};

const bannedWords = message => {
    let banned = false;
    censorship.banned.forEach(word => {
        if (message.match(word)) {
            banned = true;
        }
    });
    return banned;
};

const warnedWords = message => {
    let warned = false;
    let falsePositive = false;
    censorship.false.forEach(word => { 
        if (message.match(word)) {
            falsePositive = true;   
        }
    });
    if (falsePositive) return false;
    censorship.warned.forEach(word => {
        if (message.match(word)) {
           warned = true;
        }
    });
    return warned;
};

// Event handlers

qasi
    .on('ready', () => {
        winston.info(`QASI initialized. Logged in as ${qasi.user.username}#${qasi.user.discriminator}.`)
    })
    .on('message', async message => {
        winston.info(
            stripIndents`${message.author.username} in ${message.channel.name}:
            >>> ${message.cleanContent}`
            );
        if (message.author.bot) return; // Ignore self and all bots
        if (message.channel.type === 'dm') return; // Ignore dms
        // Guild messages from here on
        if (!await isExempt(message)) {
            winston.info(`banned?: ${bannedWords(message.cleanContent.toLowerCase())}`);
            winston.info(`warned?: ${warnedWords(message.cleanContent.toLowerCase())}`);
        } else {
            winston.log('clean');
        }
    })
    .on('disconnect', () => {
        winston.warn('QASI disconnected from Discord.')
    })
    .on('reconnecting', () => {
        winston.warn('QASI reconnecting to Discord.')
    })
    .on('error', winston.error)
    .on('warn', winston.warn);

qasi.login(config.auth.token);
