const http = require('http');
const https = require('https');
const convert = require('xml-js');
const { RichEmbed } = require('discord.js');

module.exports = {
    search: (series, tags) => {
        return new Promise((response, reject) => {
            const request = http.get(`http://gelbooru.com/index.php?page=dapi&s=post&q=index&tags=${series}+rating:safe+-furry+-bestiality+${tags}`, res => {
                let xml = '';
                res.on('data', chunk => {
                    xml += chunk;
                });
                res.on('end', () => {
                    response(convert.xml2json(xml, { compact: true, spaces: 4 }));
                });
            })
        });
    },
    sendResults: (result, message) => {
        const results = JSON.parse(result);
        if (results.posts.post === undefined) {
            message.reply(`couldn't find anything, sorry :worried:`);
            return;
        }
        const number_of_posts = results.posts.post.length;
        let post = null;
        if (number_of_posts === undefined) {
            post = results.posts.post._attributes;
        } else {
            post = results['posts'].post[Math.floor(Math.random()*number_of_posts)]._attributes;
        }
        message.channel.sendEmbed(new RichEmbed()
            .setTitle(`view source`)
            .setURL(`http://gelbooru.com/index.php?page=post&s=view&id=${post.id}`)
            .setImage(`https:${post.sample_url}`)
            .setFooter(`searching for ${message.author.username}`, message.author.avatarURL)
            .setDescription(post.tags.substr(0,500).replace('_', '\_'))
            .setColor(8700043));    
    },
    safeSearch: (tags) => {
        return new Promise((response, reject) => {
            const request = https.get(`https://safebooru.org/index.php?page=dapi&s=post&q=index&tags=${tags}+-furry+-bestiality`, res => {
                let xml = '';
                res.on('data', chunk => {
                    xml += chunk;
                });
                res.on('end', () => {
                    response(convert.xml2json(xml, { compact: true, spaces: 4 }));
                });
            })
        });
    },
    safeResults: (result, message) => {
        const results = JSON.parse(result);
        if (results.posts.post === undefined) {
            message.reply(`couldn't find anything, sorry :worried:`);
            return;
        }
        const number_of_posts = results.posts.post.length;
        let post = null;
        if (number_of_posts === undefined) {
            post = results.posts.post._attributes;
        } else {
            post = results['posts'].post[Math.floor(Math.random()*number_of_posts)]._attributes;
        }
        message.channel.sendEmbed(new RichEmbed()
            .setTitle(`view source`)
            .setURL(`https://safebooru.org/index.php?page=post&s=view&id=${post.id}`)
            .setImage(`https:${post.sample_url}`)
            .setFooter(`searching for ${message.author.username}`, message.author.avatarURL)
            .setDescription(post.tags.substr(0,500).replace('_', '\_'))
            .setColor(8700043));    
    }
}