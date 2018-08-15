const { encode } = require('querystring');

module.exports = async function linkRoute (app) {
  const data = encode({
    scope: 'identify',
    response_type: 'code',
    client_id: this.user.id,
    redirect_uri: `${this.config.WEB_DOMAIN}/auth/discordcb`
  });

  app.get('/link', (req, res) => {
    res.redirect(`https://discordapp.com/oauth2/authorize?${data}`);
  });
};
