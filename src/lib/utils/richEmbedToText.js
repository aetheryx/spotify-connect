const hyperlinkRegex = /\[(.*?)\]\((.*?)\)/g;

module.exports = ({ embed }) => {
  let output = '';

  if (embed.title) {
    let emoji = '';

    if (!(/[A-z]/).test(embed.title[0])) {
      const split = embed.title.split(' ');
      emoji = `${split.shift()} `;
      embed.title = split.join(' ');
    } else {
      output += `${emoji}**__${embed.title}__**\n\n`;
    }
  }

  if (embed.description) {
    output += `${embed.description}\n\n`;
  }

  for (const field of embed.fields || []) {
    if (field.name !== '\u200b') {
      output += `**${field.name}**\n${field.value}\n\n`;
    }
  }

  if (embed.footer) {
    output += `*${embed.footer.text}*`;
  }

  if (embed.timestamp) {
    output += ` | ${embed.timestamp.toUTCString()}`;
  }

  return output.replace(hyperlinkRegex, '$1 (<$2>)');
};
