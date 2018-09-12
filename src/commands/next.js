const { SpotifyPlayer } = require('@sc/rest');
const { LinkedCommand } = require('@sc/models');

module.exports = class NextCommand extends LinkedCommand {
  constructor (main) {
    super(main, {
      description: 'Plays the next song.',
      triggers: [ 'next', 'skip', 'kip' ],
      order: 6
    });
  }

  async execute (link) {
    await SpotifyPlayer.next(link);
    return 'Playing next track...';
  }
};
