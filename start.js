// a piece of meme history https://github.com/Aetheryx/spotify-connect/pull/3
const Tweetcord2 = require(`${__dirname}/src/`);

const config = require(`${__dirname}/config.json`);
config.BOT_ID = Buffer.from(config.BOT_TOKEN.split('.')[0], 'base64').toString();
// Bind config to global env
for (const key in config) {
  process.env[key] = config[key];
}

new Tweetcord2(config).init();
