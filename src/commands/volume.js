const { LinkedCommand } = require('@sc/models');
const { spotifyOAuth } = require('@sc/rest');

module.exports = class VolumeCommand extends LinkedCommand {
  constructor (main) {
    super(main, {
      triggers: [ 'volume', 'vol', 'v' ],
      requiresPlayer: true
    });
  }

  async execute (link, player, msg, [ volume ]) {
    const currentVolume = player.device.volume_percent;

    if (!volume) {
      return `Your volume is currently \`${currentVolume}%\`.`;
    }

    if (volume.toLowerCase() === 'max') {
      volume = '100';
    }

    if (volume.startsWith('+')) {
      volume = currentVolume + Number(volume.slice(1));
    } else if (volume.startsWith('-')) {
      volume = currentVolume - Number(volume.slice(1));
    }

    if (!volume) {
      return 'You have to specify the volume as a number.';
    }

    if (volume < 0) {
      return 'The target volume cannot be below `0%`.';
    }

    if (volume > 100) {
      return 'The target volume cannot be above `100%`.';
    }

    await spotifyOAuth.setVolume(link, volume);
    return `Set volume to \`${volume}%\`.`;
  }
};
