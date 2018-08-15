module.exports = {
  async execute (msg) {
    const link = await this.main.db.links.get(msg.author.id);
    if (link) {
      return `You've already been linked with the Spotify account \`${link.spotifyUsername}\`.`;
    }

    return `Link your Spotify account here: ${process.env.WEB_DOMAIN}/link`;
  },

  triggers: [ 'link' ]
};
