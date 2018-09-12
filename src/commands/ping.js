const { Command } = require('@sc/models');

module.exports = class PingCommand extends Command {
  constructor (main) {
    super(main, {
      description: 'Returns the latency of the bot to Discord API.',
      triggers: [ 'ping' ],
      order: 11
    });
  }

  async execute (msg) {
    const { latency } = msg.channel.guild
      ? msg.channel.guild.shard
      : this.main.shards.get(0);

    return `🏓 Pong! ${latency.toFixed()}ms`;
  }
};
