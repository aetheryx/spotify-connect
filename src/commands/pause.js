const { spotifyOAuth } = require('@sc/rest');

module.exports = {
  async execute (msg) {
    const link = await this.main.db.links.get(msg.author.id);
    if (!link) {
      return 'no';
    }

    const player = await spotifyOAuth.getPlayer(link);
    if (player.is_playing) {
      await spotifyOAuth.pause(link);
    } else {
      await spotifyOAuth.resume(link);
    }

    return 'yes';
  },

  triggers: [ 'pause' ]
};
