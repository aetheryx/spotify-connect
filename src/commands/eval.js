const { Command } = require('@sc/models');
const { inspect } = require('util');
const { codeblock } = require('@sc/utils');

module.exports = class EvalCommand extends Command {
  constructor (main) {
    super(main, {
      description: 'Lets you execute arbitrary JavaScript.',
      usage: '{c} <script>',
      examples: [ '{c} console.log(this);' ],
      triggers: [ 'eval', 'e', 'ev' ],
      ownerOnly: true
    });

    this.credentialRegex = RegExp(
      Object.keys(main.config)
        .filter(key => key.includes('SECRET') || key.includes('TOKEN'))
        .map(key => main.config[key])
        .join('|'),
      'gi'
    );
  }

  async execute (msg, args) {
    const depth = args.find(arg => arg.startsWith('--depth'))
      ? Number(args.splice(args.indexOf(args.find(arg => arg.startsWith('--depth'))), 1)[0].slice(8))
      : 1;

    const input = args.join(' ');
    if (!input) {
      return 'Missing required arguments.';
    }

    let result;

    try {
      // eslint-disable-next-line no-eval
      result = await eval(
        input.includes('await')
          ? `(async () => { ${input} })()`
          : input
      );
    } catch (err) {
      result = err;
    }

    result = this.redact(inspect(result, {
      depth
    }));

    return `${input}\n${codeblock(result, 'js')}`;
  }

  redact (content) {
    return content
      .replace(
        this.credentialRegex,
        'i think the fuck not you trick ass bitch'
      );
  }
};
