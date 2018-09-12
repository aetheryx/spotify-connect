const SpotifyConnect = require(`${__dirname}/src/`);

const config = require(`${__dirname}/config.json`);
config.BOT_ID = Buffer.from(config.BOT_TOKEN.split('.')[0], 'base64').toString();
// Bind config to global env
for (const key in config) {
  process.env[key] = config[key];
}

new SpotifyConnect(config).init();
