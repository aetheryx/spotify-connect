const { Command } = require('@sc/models');

module.exports = class InviteCommand extends Command {
  constructor (main) {
    super(main, {
      description: 'Get the invite link for the bot.',
      triggers: [ 'invite', 'inv' ],
      order: 9
    });
  }

  async execute () {
    return {
      description: `Click [here](https://discordapp.com/api/oauth2/authorize?client_id=${this.main.user.id}&permissions=280640&scope=bot) to invite the bot.`
    };
  }
};
