const { LinkedCommand } = require('@sc/models');
const { spotifyOAuth } = require('@sc/rest');

const repeatStates = {
  off: 'off',
  on: 'context',
  song: 'track',
  track: 'track'
};

const humanisedRepeatStates = {
  off: 'off',
  context: 'on',
  track: 'song'
};

module.exports = class RepeatCommand extends LinkedCommand {
  constructor (main) {
    super(main, {
      description: 'Lets you set the repeat mode.',
      usage: '{c} [ on | track | off ]',
      examples: [ '{c} track', '{c} off' ],
      triggers: [ 'repeat', 'rep' ],
      requiresPlayer: true,
      order: 9
    });
  }

  async execute (link, player, msg, [ target ]) {
    if (!target) {
      return `Repeat is currently set to \`${humanisedRepeatStates[player.repeat_state]}\`.`;
    }

    const repeatState = repeatStates[target];

    if (!repeatState) {
      return `\`${target}\` is not a valid repeat mode. Specify one of \`on\`, \`off\` or \`track\`.`;
    }

    await spotifyOAuth.setRepeatMode(link, repeatState);
    return `Successfully set repeat mode to \`${target}\`.`;
  }
};
