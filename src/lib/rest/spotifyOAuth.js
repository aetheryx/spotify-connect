const { get, put, post } = require('@sc/http');

module.exports = {
  BASE_URL: 'https://api.spotify.com/v1',
  BASE_OAUTH_URL: 'https://accounts.spotify.com/api',

  getOrRefreshToken (props) {
    return post(`${this.BASE_OAUTH_URL}/token`)
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

  pause (link) {
    return put(`${this.BASE_URL}/me/player/pause`)
      .set('Authorization', `Bearer ${link.auth.access_token}`);
  },

  resume (link) {
    return put(`${this.BASE_URL}/me/player/play`)
      .set('Authorization', `Bearer ${link.auth.access_token}`);
  },

  getPlayer (link) {
    return get(`${this.BASE_URL}/me/player`)
      .set('Authorization', `Bearer ${link.auth.access_token}`)
      .then(r => r.body);
  }
};
