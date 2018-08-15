const config = require(`${__dirname}/config.json`);
const SpotifyConnect = require(`${__dirname}/src/`);

new SpotifyConnect(config).init();
