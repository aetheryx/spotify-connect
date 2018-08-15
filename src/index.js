const { Client } = require('eris');
const { log, mergeDefaults } = require('@sc/utils/');

const events    = require(`${__dirname}/events/`);
const createDB  = require(`${__dirname}/db/`);
const commands  = require(`${__dirname}/commands/`);
const createAPI = require(`${__dirname}/api/`);

module.exports = class SpotifyConnect extends Client {
  constructor (config) {
    super(config.token, {
      // TODO: client config
    });

    this.config = config;
    this.db = null;
    this.commands = new Map();
    this.aliases = new Map();
  }

  async init () {
    log('Booting...');

    this.connect();
    this.loadCommands();

    for (const event of events) {
      this[event.type](event.name, event.listener.bind(this));
    }

    this.db = await createDB(this);
    createAPI(this);

    log(`Successfully initiated in ${process.uptime().toFixed(2)}s.`);
  }

  async loadCommands () {
    for (const command of commands) {
      mergeDefaults(command, {
        bot: this,
        usage: '{c}',
        examples: [],
        ownerOnly: false
      });

      this.commands.set(command.triggers[0], command);

      for (const trigger of command.triggers.slice(1)) {
        this.aliases.set(trigger, command.triggers[0]);
      }
    }

    console.log(this.commands.get('ping').execute());
    
  }
};
