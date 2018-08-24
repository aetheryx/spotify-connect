module.exports = (words) => {
  if (words.length === 1) {
    return words[0];
  }

  const lastWord = words.pop();
  return `${words.join(', ')} and ${lastWord}`;
};
