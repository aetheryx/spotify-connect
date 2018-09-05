const { LinkedCommand } = require('@sc/models');
const { parseMS, concat } = require('@sc/utils');

module.exports = class NowPlayingCommand extends LinkedCommand {
  constructor (main) {
    super(main, {
      description: 'Returns what you\'re currently playing.',
      triggers: [ 'nowplaying', 'now', 'np' ],
      requiresPlayer: true,
      order: 13
    });
  }

  async execute (link, player) {
    return {
      title: 'Now Playing',
      description: [
        `[**${player.item.name}**](${player.item.external_urls.spotify})`,
        `by ${concat(player.item.artists.map(artist => `[*${artist.name}*](${artist.external_urls.spotify})`))} \u200b`,
        player.item.album.album_type === 'album'
          ? `on [${player.item.album.name}](${player.item.album.external_urls.spotify})`
          : null,
        `\nProgress: ${parseMS(player.progress_ms)}/${parseMS(player.item.duration_ms)}`,
        `Volume: ${player.device.volume_percent}%`
      ].filter(Boolean).join('\n'),
      thumbnail: {
        url: player.item.album.images[0]
          ? player.item.album.images[0].url
          : ''
      }
    };
  }
};
