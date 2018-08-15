const { discordOAuth } = require('@sc/rest');
const { log } = require('@sc/utils');

module.exports = async function discordCallbackRoute (app) {
  app.get('/auth/discordcb', async (req, res) => {
    if (!req.query.code) {
      return res.status(400).send('Missing code querystring');
    }

    const bearer = await discordOAuth.getBearer(req.query.code);
    if (bearer.error) {
      log.error('discordCallback error', bearer);
      return res.status(500).send(`Something went wrong: <code>${bearer.error}</code><br>If the issue persists, please join <a href="https://discord.gg/Yphr6WG">Spotify Connect's support server</a> for assistance.`);
    }

    const user = await discordOAuth.getUserByBearer(bearer.access_token);
    if (!user.id) {
      log.error('discordCallback error', user);
      return res.status(500).send(`Something went wrong: <code>${user.message}</code><br>If the issue persists, please join <a href="https://discord.gg/Yphr6WG">Spotify Connect's support server</a> for assistance.`);
    }

    if (await this.db.links.get(user.id)) {
      return res.status(409).send('This Discord account is already linked. Please run the <code>unlink</code> command to unlink the account first.');
    }

    req.session.user = user;

    res.redirect('/auth/spotify');
  });
};
