const { LinkedCommand } = require('@sc/models');
const { SpotifyPlayer, SpotifyAPI } = require('@sc/rest');
const { sleep } = require('@sc/utils');

module.exports = class PlayCommand extends LinkedCommand {
  constructor (main) {
    super(main, {
      description: 'Play a song or an album.',
      usage: '{c} [ song | album (defaults to song) | @User ] [ query ]',
      examples: [
        '{c} song In My Feelings',
        '{c} In My Feelings',
        '{c} album Scorpion',
        '{c} @Aetheryx#2222'
      ],
      triggers: [ 'play', 'p' ],
      requiresPlayer: true
    });
  }

  async searchByArguments (args, link) {
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
    return { type, query, item };
  }

  async execute (link, player, msg, args) {
    if (!args[0]) {
      return `Missing required arguments. Please refer to \`${process.env.BOT_DEFAULT_PREFIX}help play\` for more information.`;
    }

    let uri, type;

    if (msg.mentions[0]) {
      const targetLink = await this.main.db.links.get(msg.mentions[0].id);
      if (!targetLink.isPublic) {
        // todo: get from spotify rp
        return `**${msg.mentions[0].username}** has not made their play data public. They have to run the \`${process.env.BOT_DEFAULT_PREFIX}privacy\` command to change this.`;
      }
      const targetPlayer = await SpotifyPlayer.getPlayer(targetLink);
      uri = targetPlayer.item.uri;
      type = targetPlayer.currently_playing_type;
    } else {
      const result = await this.searchByArguments(args, link);
      if (!result.item) {
        return `I was unable to find any search results with query \`${result.query}\` and type \`${result.type}\`.`;
      }
      uri = result.item.uri;
      type = result.type;
    }

    await SpotifyPlayer.play(link, {
      ...(type === 'track'
        ? { uris: [ uri ] }
        : { context_uri: uri }
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