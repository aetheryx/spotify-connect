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

  refreshToken (refresh_token) {
    return this.getOrRefreshToken({
      grant_type: 'refresh_token',
      refresh_token
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

  next (link) {
    return post(`${this.BASE_URL}/me/player/next`)
      .set('Authorization', `Bearer ${link.auth.access_token}`);
  },

  prev (link) {
    return post(`${this.BASE_URL}/me/player/previous`)
      .set('Authorization', `Bearer ${link.auth.access_token}`);
  },

  getPlayer (link) {
    return get(`${this.BASE_URL}/me/player`)
      .set('Authorization', `Bearer ${link.auth.access_token}`)
      .then(r => r.body);
  },

  getDevices (link) {
    return get(`${this.BASE_URL}/me/player/devices`)
      .set('Authorization', `Bearer ${link.auth.access_token}`)
      .then(r => r.body);
  },

  setVolume (link, volume) {
    return put(`${this.BASE_URL}/me/player/volume`)
      .set('Authorization', `Bearer ${link.auth.access_token}`)
      .query('volume_percent', volume);
  },

  setRepeatMode (link, state) {
    return put(`${this.BASE_URL}/me/player/repeat`)
      .set('Authorization', `Bearer ${link.auth.access_token}`)
      .query('state', state);
  },

  seek (link, position) {
    return put(`${this.BASE_URL}/me/player/seek`)
      .set('Authorization', `Bearer ${link.auth.access_token}`)
      .query('position_ms', position);
  },

  search (link, type, q) {
    return get(`${this.BASE_URL}/search`)
      .set('Authorization', `Bearer ${link.auth.access_token}`)
      .query({
        q,
        type,
        market: 'from_token'
      }).then(r => r.body);
  },

  play (link, data) {
    return put(`${this.BASE_URL}/me/player/play`)
      .set('Authorization', `Bearer ${link.auth.access_token}`)
      .send(data);
  }
};
