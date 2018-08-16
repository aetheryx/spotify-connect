const { Client } = require('eris');
const { log, mergeDefaults } = require('@sc/utils/');

const pkg       = require(`${__dirname}/../package.json`);
const events    = require(`${__dirname}/events/`);
const createDB  = require(`${__dirname}/db/`);
const commands  = require(`${__dirname}/commands/`);
const createAPI = require(`${__dirname}/web/`);

module.exports = class SpotifyConnect extends Client {
  constructor (config) {
    super(config.BOT_TOKEN, {
      // TODO: client config
    });

    this.pkg = pkg;
    this.config = config;
    this.db = null;
    this.commands = new Map();
    this.commandTriggers = new Map();
  }

  async init () {
    log('Booting...');

    for (const event of events) {
      this[event.type](event.name, event.listener.bind(this));
    }

    await this.connect();

    this.once('ready', async () => {
      this.db = await createDB(this);
      await this.loadCommands();
      await createAPI.call(this);
      log(`Successfuly initiated in ${process.uptime().toFixed(2)}s.`);
    });
  }

  async loadCommands () {
    for (const CommandClass of commands) {
      const command = new CommandClass(this);

      this.commands.set(command.props.triggers[0], command);
      for (const trigger of command.props.triggers) {
        this.commandTriggers.set(trigger, command.props.triggers[0]);
      }
    }
  }
};
