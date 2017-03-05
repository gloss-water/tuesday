const { RichEmbed } = require('discord.js');
const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');
const { guild } = require('../../data/config');

class GuildStats extends Command {
    constructor(client) {
        super(client, {
            name: 'guild',
            aliases: ['server'],
            group: 'info',
            memberName: 'guild',
            description: 'Displays the current guild\'s statistics.',
            throttling: {
                usages: 1,
                duration: 10
            }
        });
    }

    async run(message) {
        if (!message.guild) return message.reply('This command must be run on a server.');
        return message.embed(new RichEmbed()
                .setTitle(`${message.guild.name}'s stats! ^_^`)
                .setFooter(`requested by ${message.author.username}`, message.author.avatarURL)
                .setDescription(`
                    Created: ${message.guild.createdAt.toDateString()}
                    Owner: ${message.guild.owner}
                    Region: ${message.guild.region}
                    Channels: ${message.guild.channels.array().length}
                    Members: ${message.guild.memberCount}
                    ${message.guild.id === guild ? 'Invite: https://discord.gg/nyanchat' : ''}
                    `)
                .setImage(message.guild.iconURL)
                .setColor(8700043)
        );
    }
}

module.exports = GuildStats;
