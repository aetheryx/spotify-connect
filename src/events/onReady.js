const { log } = require('@sc/utils');

async function onReady () {
  log(`Connected as ${this.user.username}.`);
}

module.exports = {
  type: 'on',
  name: 'ready',
  listener: onReady
};
