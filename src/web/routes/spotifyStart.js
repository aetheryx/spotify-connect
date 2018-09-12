const { encode } = require('querystring');

module.exports = async function spotifyStartRoute (app) {
  const params = encode({
    response_type: 'code',
    client_id: process.env.SPOTIFY_ID,
    redirect_uri: `${process.env.WEB_DOMAIN}/auth/spotifycb`,
    scope: [
      'user-read-currently-playing',
      'user-modify-playback-state',
      'user-read-playback-state',
      'user-read-private',
      'playlist-read-private'
    ].join(' ')
  });

  app.get('/auth/spotify', async (req, res) => {
    if (!req.session.user) {
      return res.status(412).send(`No user profile found in session. Start at <a href="/link">${process.env.WEB_DOMAIN}/link<a>.<br>If the issue persists, please join <a href="https://discord.gg/Yphr6WG">Spotify Connect's support server</a> for assistance.`);
    }

    res.redirect(`https://accounts.spotify.com/authorize?${params}`);
  });
};
