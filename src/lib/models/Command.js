module.exports = class Command {
  constructor (main, props) {
    this.main = main;
    this.props = {
      usage: '{c}',
      examples: [],
      ownerOnly: false,
      ...props
    };
  }

  _execute (...args) {
    return this.execute(...args);
  }
};
