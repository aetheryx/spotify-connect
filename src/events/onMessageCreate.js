const { codeblock, richEmbedToText } = require('@sc/utils/');

async function onMessageCreate (msg) {
  if (msg.author.bot) {
    return;
  }

  const prefix = await (() => {
    const mentionPrefix = msg.content.match(new RegExp(`^<@!?${this.user.id}>`));

    if (mentionPrefix) {
      if (msg.content.lastIndexOf(mentionPrefix[0]) === 0) {
        msg.mentions = msg.mentions.filter(u => u.id !== this.user.id);
      }
      return `${mentionPrefix[0]} `;
    }

    // TODO: custom prefixes
    return process.env.BOT_DEFAULT_PREFIX;
  })();

  if (!msg.content.startsWith(prefix)) {
    return;
  }

  const [ commandName, ...args ] = msg.content.slice(prefix.length).split(/ +/g);
  const command = this.commands.get(this.commandTriggers.get(commandName));
  if (
    !command || (
      command.props.ownerOnly && msg.author.id !== process.env.BOT_OWNER_ID
    )) {
    return;
  }

  const permissions = msg.channel.permissionsOf(this.user.id);
  if (!permissions.has('sendMessages')) {
    return;
  }

  command
    ._execute(msg, args)
    .catch(err => {
      console.error(err);

      return {
        title: '⚠ Something went wrong while executing this command.',
        color: 0xFF0000,
        description: codeblock(
          err.message + (
            err.body && err.body.error
              ? `\n${err.body.error.message}`
              : ''
          )
        )
      };
    })
    .then(res => {
      if (!res) {
        return;
      }

      if (res instanceof Object) {
        res = {
          content: res.content || '',
          embed: {
            color: res.color || 0x1DB954,
            ...res
          }
        };

        if (!permissions.has('embedLinks')) {
          res = richEmbedToText(res);
        }
      }

      msg.channel.createMessage(res);
    });
}

module.exports = {
  type: 'on',
  name: 'messageCreate',
  listener: onMessageCreate
};
