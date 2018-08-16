const { Command } = require('@sc/models');

module.exports = class PingCommand extends Command {
  constructor (main) {
    super(main, {
      triggers: [ 'ping' ]
    });
  }

  async execute (msg) {
    return `🏓 Pong! ${msg.channel.guild.shard.latency}ms`;
  }
};
