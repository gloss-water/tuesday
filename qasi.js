// Dependencies
const { Client, SQLiteProvider } = require('discord.js-commando');
const winston = require('winston');
const path = require('path');
const sqlite = require('sqlite');

// Configuration
const config = require('./data/config');

// Client set up
const qasi = new Client({
	owner: config.auth.owner,
	commandPrefix: config.prefix
});
qasi.setProvider(
	sqlite.open(path.join(__dirname + '/data', 'dbqasi.sqlite3'))
		.then(db => new SQLiteProvider(db))
);
qasi.registry.registerGroups([
	['admin', 'Administration']
]).registerDefaults().registerCommandsIn(path.join(__dirname, 'commands'));


qasi
	.on('ready', () => {
		winston.info(`QASI initialized. Logged in as ${qasi.user.username}#${qasi.user.discriminator}.`)
	})
	.on('message', message => {
		winston.info(message.cleanContent);
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
