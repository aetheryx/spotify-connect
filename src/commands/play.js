const { LinkedCommand } = require('@sc/models');
const { SpotifyPlayer, SpotifyAPI } = require('@sc/rest');
const { sleep } = require('@sc/utils');

module.exports = class PlayCommand extends LinkedCommand {
  constructor (main) {
    super(main, {
      description: 'Play a song or an album.',
      usage: '{c} [ song | album (defaults to song) ] <query>',
      examples: [
        '{c} song In My Feelings',
        '{c} In My Feelings',
        '{c} album Scorpion'
      ],
      triggers: [ 'play', 'p' ],
      requiresPlayer: true
    });
  }

  async execute (link, player, msg, args) {
    if (!args[0]) {
      // TODO: custom prefixes
      return `Missing required arguments. Please refer to \`${process.env.BOT_DEFAULT_PREFIX}help play\` for more information.`;
    }

    let type, query;

    switch (args[0]) {
      case 'album':
        type = 'album';
        query = args.slice(1).join(' ');
        break;

      case 'song':
      case 'track':
        args.shift();

      // eslint-disable-next-line no-fallthrough
      default:
        query = args.join(' ');
        type = 'track';
    }

    const res = await SpotifyAPI.search(link, type, query);
    // TODO: letting users select a specific track from the list of results

    const { items: [ item ] } = res.tracks || res.albums;
    if (!item) {
      return `I was unable to find any search results with query \`${query}\` and type \`${type}\`.`;
    }

    await SpotifyPlayer.play(link, {
      ...(type === 'track'
        ? { uris: [ item.uri ] }
        : { context_uri: item.uri }
      )
    });

    await Promise.race([
      sleep(2000),
      (async () => {
        let tries = 0;

        while (tries < 5) {
          tries++;
          const newPlayer = await SpotifyPlayer.getPlayer(link);

          if (newPlayer.item.id !== player.item.id) {
            break;
          }

          await sleep(100);
        }
      })()
    ]);

    return this.main.commands.get('nowplaying')._execute(msg, []);
  }
};