const { bindToEnv } = require('@sc/utils');
const SpotifyConnect = require(`${__dirname}/src/`);

const config = require(`${__dirname}/config.json`);
config.BOT_ID = Buffer.from(config.BOT_TOKEN.split('.')[0], 'base64').toString();

bindToEnv(config);

new SpotifyConnect(config).init();
