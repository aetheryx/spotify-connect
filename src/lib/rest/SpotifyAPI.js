const { get } = require('@sc/http');

module.exports = {
  BASE_URL: 'https://api.spotify.com/v1',

  search (link, type, q) {
    return get(`${this.BASE_URL}/search`)
      .set('Authorization', `Bearer ${link.auth.access_token}`)
      .query({
        q,
        type,
        market: 'from_token'
      }).then(r => r.body);
  },

  getPlaylists (link) {
    return get(`${this.BASE_URL}/me/playlists`)
      .set('Authorization', `Bearer ${link.auth.access_token}`)
      .then(r => r.body);
  }
};
