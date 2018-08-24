const { spotifyOAuth } = require('@sc/rest');
const { LinkedCommand } = require('@sc/models');

module.exports = class PreviousCommand extends LinkedCommand {
  constructor (main) {
    super(main, {
      description: 'Plays the previous song.',
      triggers: [ 'previous', 'prev' ]
    });
  }

  async execute (link) {
    await spotifyOAuth.prev(link);
    return 'Playing previous track...';
  }
};
