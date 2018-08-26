// TODO: verify volume changes because android mobile is fucky

const { LinkedCommand } = require('@sc/models');
const { spotifyOAuth } = require('@sc/rest');

module.exports = class VolumeCommand extends LinkedCommand {
  constructor (main) {
    super(main, {
      description: 'Lets you change the volume of the currently playing track.',
      usage: '{c} [ absolute_% | +amount_% | -amount_% ]',
      examples: [
        '{c} 50  (sets the volume to 50%)',
        '{c} +10 (increases the volume by 10%)',
        '{c} -10 (decreases the volume by 10%)',
        '{c} max (sets the volume to 100%)'
      ],
      triggers: [ 'volume', 'vol', 'v' ],
      requiresPlayer: true,
      order: 8
    });
  }

  async execute (link, player, msg, [ volume ]) {
    const currentVolume = player.device.volume_percent;

    if (!volume) {
      return `Your volume is currently \`${currentVolume}%\`.`;
    }

    if (volume.toLowerCase() === 'max') {
      volume = 100;
    } else if (volume.startsWith('+')) {
      volume = currentVolume + Number(volume.match(/\d+/)[0]);
    } else if (volume.startsWith('-')) {
      volume = currentVolume - Number(volume.match(/\d+/)[0]);
    } else if (!isNaN(volume)) {
      volume = Number(volume);
    } else {
      // TODO: custom prefixes
      return 'The supplied arguments are invalid. Please refer to `s;help volume` for more information.';
    }

    if (volume < 0) {
      return 'The target volume cannot be below `0%`.';
    } else if (volume > 100) {
      return 'The target volume cannot be above `100%`.';
    }

    await spotifyOAuth.setVolume(link, volume);
    return `Set volume to \`${volume}%\`.`;
  }
};
