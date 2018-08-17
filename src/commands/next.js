const { spotifyOAuth } = require('@sc/rest');
const { LinkedCommand } = require('@sc/models');

module.exports = class NextCommand extends LinkedCommand {
  constructor (main) {
    super(main, {
      triggers: [ 'next', 'skip' ]
    });
  }

  async execute (link) {
    await spotifyOAuth.next(link);
    return 'Playing next track...';
  }
};
