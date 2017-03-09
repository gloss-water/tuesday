// Dependencies
const { Client, SQLiteProvider } = require('discord.js-commando');
const winston = require('winston');
const sqlite = require('sqlite');
const config = require('./data/config');

// Client set up
const tuesday = new Client({
    owner: config.auth.ownerID,
    commandPrefix: config.prefix
});
tuesday.setProvider(
    sqlite.open(path.join(__dirname + '/data', 'tuesday.sqlite3'))
        .then(db => new SQLiteProvider(db))
);
tuesday.registry.registerGroups([
    ['booru', 'Image Search']
]).registerDefaults().registerCommandsIn(path.join(__dirname, 'commands'));

// Event handlers
tuesday
    .once('ready', () => {
        winston.info(`tuesday initialized. Logged in as ${tuesday.user.username}#${tuesday.user.discriminator}.`);
    })
    .on('disconnect', () => {
        winston.warn('tuesday disconnected from Discord.')
    })
    .on('reconnecting', () => {
        winston.warn('tuesday reconnecting to Discord.')
    })
    .on('error', winston.error)
    .on('warn', winston.warn);

tuesday.login(config.auth.token);
