const { LinkedCommand } = require('@sc/models');
const { spotifyOAuth } = require('@sc/rest');
const { parseMS } = require('@sc/utils');

module.exports = class SeekCommand extends LinkedCommand {
  constructor (main) {
    super(main, {
      description: 'Lets you seek to a specific timestamp in the song.',
      usage: '{c} < absolute_timestamp | +amount | -amount >',
      examples: [
        '{c} 01:30 (seeks to exactly 01:30)',
        '{c} +30 (seeks 30 seconds ahead)',
        '{c} -30 (seeks 30 seconds back)'
      ],
      triggers: [ 'seek' ],
      requiresPlayer: true,
      order: 7
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
      return `I was unable to parse \`${target}\` as a valid seek argument. Please refer to \`${process.env.BOT_DEFAULT_PREFIX}help\` seek for more information.`; // TODO: dynamic prefix
    }

    await spotifyOAuth.seek(link, position);
    const realPosition = Math.min(position, player.item.duration_ms);

    return `Seeked to \`${parseMS(realPosition)}\`.`;
  }
};
