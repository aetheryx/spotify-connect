const { SpotifyPlayer } = require('@sc/rest');
const { LinkedCommand } = require('@sc/models');

module.exports = class ResumeCommand extends LinkedCommand {
  constructor (main) {
    super(main, {
      description: 'Resumes playback.',
      triggers: [ 'resume', 'r' ],
      requiresPlayer: true,
      order: 4
    });
  }

  async execute (link, player) {
    if (player.is_playing) {
      return 'You\'re already playing something. Use the `pause` command to pause.';
    }

    await SpotifyPlayer.resume(link);

    return 'Resumed successfully. Use the `pause` command to pause.';
  }
};
