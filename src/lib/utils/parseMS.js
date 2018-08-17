module.exports = (ms) => {
  const fullS = ms / 1000;
  const fullM = Math.floor(fullS / 60).toString().padStart(2, '0');
  const restS = Math.floor(fullS % 60).toString().padStart(2, '0');

  return `${fullM}:${restS}`;
};
