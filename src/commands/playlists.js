const { LinkedCommand } = require('@sc/models');
const { SpotifyAPI, SpotifyPlayer } = require('@sc/rest');

module.exports = class PlaylistsCommand extends LinkedCommand {
  constructor (main) {
    super(main, {
      description: 'Lets you list or play your playlists.',
      usage: '{c} [ list | play ] [ playlist_name ]',
      examples: [
        '{c} list',
        '{c} play My Playlist'
      ],
      triggers: [ 'playlists', 'playlist', 'pl' ],
      order: 15
    });
  }

  async execute (link, msg, args) {
    const playlists = await SpotifyAPI.getPlaylists(link);
    if (!playlists.items[0]) {
      return 'You have no playlists.';
    }

    switch (args[0]) {
      case 'list':
        return {
          title: 'Your Playlists',
          fields: playlists.items.map(playlist => ({
            name: playlist.name,
            value: `${playlist.tracks.total} tracks`
          }))
        };

      case 'play': {
        const target = args.slice(1).join(' ');
        const playlist = playlists.items.find(item => item.name.toLowerCase().contains(target.toLowerCase()));
        if (!playlist) {
          // TODO: custom prefixes
          return `I was unable to find that playlist. Please refer to \`${process.env.BOT_DEFAULT_PREFIX}playlist list\` for a list of your playlists.`;
        }

        await SpotifyPlayer.play(link, { context_uri: playlist.uri });
        return `Now playing playlist \`${playlist.name}\`.`;
      }

      default:
        // TODO: custom prefixes
        return `First argument must be one of \`list\` or \`play\`. Please refer to \`${process.env.BOT_DEFAULT_PREFIX}help playlist\` for more information.`;
    }
  }
};
