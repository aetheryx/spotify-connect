const { post } = require('@sc/http');

module.exports = {
  BASE_URL: 'https://accounts.spotify.com/api',

  getOrRefreshToken (props) {
    return post(`${this.BASE_URL}/token`)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', `Basic ${Buffer.from(`${process.env.SPOTIFY_ID}:${process.env.SPOTIFY_SECRET}`).toString('base64')}`)
      .send({
        redirect_uri: `${process.env.WEB_DOMAIN}/auth/spotifycb`,
        ...props
      }).then(r => r.body);
  },

  getToken (code) {
    return this.getOrRefreshToken({
      grant_type: 'authorization_code',
      code
    });
  },

  refreshToken (refresh_token) {
    return this.getOrRefreshToken({
      grant_type: 'refresh_token',
      refresh_token
    });
  },
};
