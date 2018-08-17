const { LinkedCommand } = require('@sc/models');
const { spotifyOAuth } = require('@sc/rest');
const { parseMS } = require('@sc/utils');

module.exports = class SeekCommand extends LinkedCommand {
  constructor (main) {
    super(main, {
      triggers: [ 'seek' ],
      requiresPlayer: true
    });
  }

  async execute (link, player, msg, args) {
    const target = args.join(' ');
    if (!target) {
      return 'Missing required arguments. Where do you want to seek to?';
    }

    let position;

    if (target.includes(':')) {
      const [ min, sec ] = target.split(':').map(Number);
      position = ((60 * min) + sec) * 1000;
    } else if (target.startsWith('+')) {
      position = player.progress_ms + (Number(target.slice(1)) * 1000);
    } else if (target.startsWith('-')) {
      position = player.progress_ms - (Number(target.slice(1)) * 1000);
    }

    if (!position) {
      return `I was unable to parse \`${target}\` as a valid seek argument. Please refer to s;help seek for more information.`; // TODO: dynamic prefix
    }

    await spotifyOAuth.seek(link, position);
    const realPosition = position > player.item.duration_ms
      ? player.item.duration_ms
      : position;

    return `Seeked to \`${parseMS(realPosition)}\`.`;
  }
};
