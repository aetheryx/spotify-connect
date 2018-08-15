const { dirname, join } = require('path');
const { readdirSync } = require('fs');

const typeMap = {
  [Object]: (_module, _dirname) => (filename) => {
    const moduleName = filename.split('.')[0];
    _module.exports[moduleName] = require(join(_dirname, filename));
  },
  [Array]: (_module, _dirname) => {
    _module.exports = [];
    return (filename) => {
      _module.exports.push(require(join(_dirname, filename)));
    };
  }
};

module.exports = (opts) => {
  const _dirname = dirname(opts.module.filename);

  readdirSync(_dirname)
    .filter(file => file !== 'index.js')
    .map(typeMap[opts.type](opts.module, _dirname));
};
