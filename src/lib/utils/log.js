const colors = {
  info: '\u001b[32m',
  warn: '\u001b[33m',
  error: '\u001b[31m',
  reset: '\u001b[39m'
};

const log = (type, ...args) => {
  const datePrefix = new Date()
    .toUTCString()
    .split(' ')
    .slice(1, 5)
    .join(' ');

  console.log(
    `${colors[type]}[${datePrefix}, ${type.toUpperCase()}]${colors.reset}`,
    ...args
  );
};

module.exports = (...args) => log('info', ...args);
for (const type in colors) {
  module.exports[type] = (...args) => log(type, ...args);
}
