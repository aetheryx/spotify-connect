const { Command } = require('@sc/models');
const { codeblock } = require('@sc/utils');

module.exports = class StatsCommand extends Command {
  constructor (main) {
    super(main, {
      description: 'You\'re looking at it, dumbass.',
      usage: '{c} [ commandName ]',
      examples: [ '{c}', '{c} volume' ],
      triggers: [ 'help', 'h' ],
      order: 0
    });
  }

  async execute (msg, [ commandName ]) {
    if (commandName) {
      commandName = this.main.commandTriggers.get(commandName.toLowerCase());
      if (!commandName) {
        return 'I was unable to find a command with that name.';
      }

      const template = (string) => string.replace('{c}', `s;${commandName}`); // TODO: custom prefixes

      const command = this.main.commands.get(commandName);

      return {
        title: `Help for command ${commandName}`,
        description: command.props.description || '',
        fields: [
          { name: 'Usage', value: codeblock(template(command.props.usage)) },

          ...(command.props.examples[0]
            ? [ {
              name: 'Examples',
              value: codeblock(command.props.examples.map(template).join('\n'))
            } ]
            : []),

          ...(command.props.triggers[1]
            ? [ {
              name: 'Aliases',
              value: command.props.triggers
                .filter(t => t !== commandName)
                .map(t => `\`${t}\``)
                .join(', ')
            } ]
            : [])
        ]
      };
    }

    const getPropLength = (command) => command.props.triggers[0].length;

    const commands = [ ...this.main.commands.values() ]
      .filter(command => !command.props.ownerOnly);

    const longestCommandName = getPropLength(commands.sort((a, b) => getPropLength(b) - getPropLength(a))[0]);

    return {
      // TODO: custom prefixes
      // TODO: link on website
      content: 'My prefix in this server is `s;`, but you can also mention me.\n\nTo get started, run the `s;link` command to link your Spotify account. After you do so, you can run all of the playback-related commands.\n\nAdditionally, run `s;help [command]` for more information regarding that specific command. For example, `s;help repeat`.',
      title: 'List of Commands',
      description: commands
        .sort((a, b) => a.props.order - b.props.order)
        .map(command => {
          const { triggers: [ trigger ], description } = command.props;

          return `\`${trigger.padEnd((longestCommandName * 2) - trigger.length, ' \u200b')} |\` \u200b \u200b*${description}*`;
        })
        .join('\n')
    };
  }
};
