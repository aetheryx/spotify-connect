const express = require('express');
const session = require('express-session');

const { log } = require('@sc/utils');

const routes = require(`${__dirname}/routes`);

module.exports = function createAPI () {
  const app = express();

  app.use(session({
    secret: this.config.WEB_SECRET,
    saveUninitialized: true,
    resave: false
  }));

  app.listen(this.config.WEB_PORT, () => {
    log(`Express server listening to ${this.config.WEB_PORT}.`);
  });

  for (const route of routes) {
    route.call(this, app);
  }
};
