module.exports = (sourceObj, defaults) => {
  for (const def in defaults) {
    if (!sourceObj[def]) {
      sourceObj[def] = defaults[def];
    }
  }
};
