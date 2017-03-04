// Dependencies
const { Client, SQLiteProvider } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const winston = require('winston');
const path = require('path');
const sqlite = require('sqlite');
const { stripIndents } = require('common-tags');

// Configuration
const config = require('./data/config');
const censorship = require('./data/censorship');
let home = '';

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
    .once('ready', () => {
        winston.info(`QASI initialized. Logged in as ${qasi.user.username}#${qasi.user.discriminator}.`);
        home = qasi.channels.get(config.home);
    })
    .on('message', async message => {
        winston.info(
            stripIndents`${message.author.username} in ${message.channel.name}:
            >>> ${message.cleanContent}`
            );
        if (message.author.bot) return; // Ignore self and all bots
        if (message.channel.type === 'dm') return; // Ignore dms
        
        // Guild messages from here on.

        // Check if any disallowed words from unexempt users and tell on them.
        if (!await isExempt(message)) {
            if (bannedWords(message.cleanContent.toLowerCase())) {
                home.sendEmbed(new RichEmbed()
                    .setDescription(stripIndents`
                        **Banning ${message.author} for usage of a banned word in ${message.channel}.**
                        ${message.content}
                    `)
                    .setColor(16711680)
                );
                if (message.member.bannable) message.member.ban();
                if (message.deletable) message.delete();
                return;
            }
            
            if (warnedWords(message.cleanContent.toLowerCase())) {
                home.sendEmbed(new RichEmbed()
                    .setDescription(stripIndents`
                        **🚨 Funny Alert 🚨 ${message.author} in ${message.channel}.**
                        ${message.content}
                    `)
                    .setColor(16737330)
                );
                return true;
            }
        } else {
            winston.log('clean');
        }
    })
    .on('messageDelete', async message => {
        if (message.author.id === qasi.user.id) return;
        if (message.channel.id === home.id) return;
        if (await isExempt(message)) return;
        home.sendEmbed(new RichEmbed()
            .setDescription(stripIndents`
                **Message from ${message.author} deleted in ${message.channel}.**
                ${message.content}
            `)
            .setColor(8700043)
        );
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
