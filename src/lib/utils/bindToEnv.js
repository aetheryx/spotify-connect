module.exports = (config) => {
  for (const key in config) {
    process.env[key] = config[key];
  }
};
