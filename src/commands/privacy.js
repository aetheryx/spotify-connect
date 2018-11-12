const { LinkedCommand } = require('@sc/models');

module.exports = class PrivacyCommand extends LinkedCommand {
  constructor (main) {
    super(main, {
      description: 'Lets you make your play data public so others can listen with you.',
      triggers: [ 'privacy' ],
      order: 14
    });
  }

  async execute (link, msg, args) {
    switch (args[0] && args[0].toLowerCase()) {
      case 'private':
        await this.main.db.links.setPrivacy(link, false);
        return 'I made your play data **private**. Other users are now **unable** to see what you are listening to through the bot.';

      case 'public':
        await this.main.db.links.setPrivacy(link, true);
        return 'I made your play data **public**. Other users are now **able** to see what you are listening to through the bot.';

      default:
        return 'You have to specify one of `public` or `private`.'
    }
  }
};
