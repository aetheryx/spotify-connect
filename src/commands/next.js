const { spotifyOAuth } = require('@sc/rest');
const { LinkedCommand } = require('@sc/models');

module.exports = class NextCommand extends LinkedCommand {
  constructor (main) {
    super(main, {
      description: 'Plays the next song.',
      triggers: [ 'next', 'skip' ],
      order: 6
    });
  }

  async execute (link) {
    await spotifyOAuth.next(link);
    return 'Playing next track...';
  }
};
