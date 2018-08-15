module.exports = {
  async execute (msg) {
    return `🏓 Pong! ${msg.channel.guild.shard.latency}ms`;
  },

  triggers: [ 'ping' ]
};
