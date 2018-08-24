const os = require('os');
const totalMem = os.totalmem();
const { VERSION: erisVersion } = require('eris');
const { version: mongoVersion } = require('mongodb/package.json');

const { parseDuration } = require('@sc/utils');
const { Command } = require('@sc/models');

module.exports = class StatsCommand extends Command {
  constructor (main) {
    super(main, {
      description: 'Returns statistics and metrics about Spotify Connect',
      triggers: [ 'stats', 'info' ]
    });
  }

  async execute (msg) {
    const { rss } = process.memoryUsage();

    return {
      title: 'Spotify Connect Statistics',
      fields: [ {
        name: 'Libraries',
        value: [
          `[Eris](https://abal.moe/Eris) v${erisVersion}`,
          `[Node.js](https://nodejs.org/en/) ${process.version}`,
          `[MongoDB](https://github.com/mongodb/node-mongodb-native/) v${mongoVersion}`
        ].join('\n'),
        inline: true
      }, {
        name: 'RAM Usage',
        value: `${(rss / 1048576).toFixed()}MB/${(totalMem / 1073741824).toFixed(1)} GB\n(${(rss / totalMem * 100).toFixed(2)}%)`,
        inline: true
      }, {
        name: 'System Info',
        value: `${process.platform} (${process.arch})\n${(
          totalMem > 1073741824
            ? `${(totalMem / 1073741824).toFixed(1)} GB`
            : `${(totalMem / 1048576).toFixed(2)} MB`)}`,
        inline: true
      }, {
        name: 'Uptime',
        value: parseDuration(process.uptime()),
        inline: true
      }, {
        name: 'Latency',
        value: `${msg.channel.guild.shard.latency.toFixed()} ms`,
        inline: true
      }, {
        name: '\u200b',
        value: '\u200b',
        inline: true
      } ],
      footer: { text: 'Created by Aetheryx#2222' }
    };
  }
};
