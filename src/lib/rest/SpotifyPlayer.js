const { get, put, post } = require('@sc/http');

module.exports = {
  BASE_URL: 'https://api.spotify.com/v1/me/player',

  pause (link) {
    return put(`${this.BASE_URL}/pause`)
      .set('Authorization', `Bearer ${link.auth.access_token}`);
  },

  resume (link) {
    return put(`${this.BASE_URL}/play`)
      .set('Authorization', `Bearer ${link.auth.access_token}`);
  },

  next (link) {
    return post(`${this.BASE_URL}/next`)
      .set('Authorization', `Bearer ${link.auth.access_token}`);
  },

  prev (link) {
    return post(`${this.BASE_URL}/previous`)
      .set('Authorization', `Bearer ${link.auth.access_token}`);
  },

  getPlayer (link) {
    return get(this.BASE_URL)
      .set('Authorization', `Bearer ${link.auth.access_token}`)
      .then(r => r.body);
  },

  getDevices (link) {
    return get(`${this.BASE_URL}/devices`)
      .set('Authorization', `Bearer ${link.auth.access_token}`)
      .then(r => r.body);
  },

  setVolume (link, volume) {
    return put(`${this.BASE_URL}/volume`)
      .set('Authorization', `Bearer ${link.auth.access_token}`)
      .query('volume_percent', volume);
  },

  setRepeatMode (link, state) {
    return put(`${this.BASE_URL}/repeat`)
      .set('Authorization', `Bearer ${link.auth.access_token}`)
      .query('state', state);
  },

  seek (link, position) {
    return put(`${this.BASE_URL}/seek`)
      .set('Authorization', `Bearer ${link.auth.access_token}`)
      .query('position_ms', position);
  },

  play (link, data) {
    return put(`${this.BASE_URL}/play`)
      .set('Authorization', `Bearer ${link.auth.access_token}`)
      .send(data);
  }
};
