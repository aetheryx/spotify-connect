const { Command } = require('@sc/models');
const { spotifyOAuth } = require('@sc/rest');
const { Errors } = require('@sc/constants');

module.exports = class LinkedCommand extends Command {
  async _execute (msg, args) {
    const link = await this.main.db.links.get(msg.author.id);
    if (!link) {
      return `You haven't linked your Spotify account yet. Please do so here: ${process.env.WEB_DOMAIN}/link`;
    }

    if (Date.now() > link.auth.expiryDate) {
      const tokens = await spotifyOAuth.refreshToken(link.auth.refresh_token);
      console.log('refreshing', tokens);
      Object.assign(link.auth, tokens);
      this.main.db.links.updateAuth(link);
    }

    const funcArgs = [ link, msg, args ];

    if (this.props.requiresPlayer) {
      const player = await spotifyOAuth.getPlayer(link);
      if (!player) {
        return 'I was unable to find any devices running Spotify on your account. Are you sure Spotify is installed and logged into on your device?';
      }

      funcArgs.splice(1, 0, player);
    }

    return this.execute(...funcArgs);
  }
};
