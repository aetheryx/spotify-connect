module.exports = class Command {
  constructor (main, params) {
    this.main = main;
    this.props = {
      usage: '{c}',
      examples: [],
      ownerOnly: false,
      ...params
    };
  }

  _execute (...args) {
    return this.execute(...args);
  }
};
