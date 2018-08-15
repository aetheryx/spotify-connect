module.exports = {
  async execute (msg) {
    const link = await this.main.db.links.get(msg.author.id);
    if (!link) {
      return `How do you want to unlink if you aren't linked yet?\n\nLink your Spotify account here: ${process.env.WEB_DOMAIN}/link`;
    }

    await this.main.db.links.remove(msg.author.id);

    return 'Your link was successfully removed from our database. Don\'t forget to revoke access here: https://spotify.com/account/apps/';
  },

  triggers: [ 'unlink' ]
};
