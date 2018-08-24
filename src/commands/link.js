const { Command } = require('@sc/models');

module.exports = class LinkCommand extends Command {
  constructor (main) {
    super(main, {
      description: 'Run this command to link up your Spotify account with your Discord account.',
      triggers: [ 'link' ]
    });
  }

  async execute (msg) {
    const link = await this.main.db.links.get(msg.author.id);
    if (link) {
      return 'You\'ve already been linked with a Spotify account.';
    }

    return `Link your Spotify account here: ${process.env.WEB_DOMAIN}/link`;
  }
};
