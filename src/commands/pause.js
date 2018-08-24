const { spotifyOAuth } = require('@sc/rest');
const { LinkedCommand } = require('@sc/models');

module.exports = class PauseCommand extends LinkedCommand {
  constructor (main) {
    super(main, {
      description: 'Pauses playback.',
      triggers: [ 'pause', 'ps' ],
      requiresPlayer: true,
      order: 3
    });
  }

  async execute (link, player) {
    if (!player.is_playing) {
      return 'You aren\'t playing anything right now. Use the `play` command to play something or the `resume` command to resume.';
    }

    await spotifyOAuth.pause(link);

    return 'Paused successfully. Use the `resume` command to resume.';
  }
};
