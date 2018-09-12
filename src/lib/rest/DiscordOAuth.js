const { get, post } = require('@sc/http');

module.exports = {
  BASE_URL: 'https://discordapp.com/api/v7',

  getBearer (code) {
    return post(`${this.BASE_URL}/oauth2/token`)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        client_id: process.env.BOT_ID,
        client_secret: process.env.BOT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${process.env.WEB_DOMAIN}/auth/discordcb`
      }).then(r => r.body);
  },

  getUserByBearer (bearer) {
    return get(`${this.BASE_URL}/users/@me`)
      .set('Authorization', `Bearer ${bearer}`)
      .then(r => r.body);
  }
};
