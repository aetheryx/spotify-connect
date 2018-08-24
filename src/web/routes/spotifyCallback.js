const { spotifyOAuth } = require('@sc/rest');
const { get } = require('@sc/http');

module.exports = async function spotifyCallbackRoute (app) {
  app.get('/auth/spotifycb', async (req, res) => {
    if (!req.session.user) {
      return res.status(412).send(`No user profile found in session. Start at <a href="/link">${process.env.WEB_DOMAIN}/link<a>.<br>If the issue persists, please join <a href="https://discord.gg/Yphr6WG">Spotify Connect's support server</a> for assistance.`);
    }

    const token = await spotifyOAuth.getToken(req.query.code);

    const user = await get('https://api.spotify.com/v1/me')
      .set('Authorization', `Bearer ${token.access_token}`)
      .then(r => r.body);

    if (user.product !== 'premium') {
      return res.status(403).send('You don\'t seem to have Spotify Premium on this account. Unfortunately, Spotify only lets users with Premium use the Connect API.. so, as things currently stand, you can\'t use the bot :(<br><img src="https://tc.bad-me.me/cfe6c6.png">');
    }

    await this.db.links.insert({
      id: req.session.user.id,
      spotifyID: user.id,
      spotifyUsername: user.display_name,
      auth: {
        access_token: token.access_token,
        refresh_token: token.refresh_token,
        expiryDate: Date.now() + (token.expires_in * 1000)
      }
    });

    res.status(200).send('k');
  });
};
