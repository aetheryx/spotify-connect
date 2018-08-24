const { LinkedCommand } = require('@sc/models');
const { spotifyOAuth } = require('@sc/rest');

module.exports = class DevicesCommand extends LinkedCommand {
  constructor (main) {
    super(main, {
      description: 'TODO',
      usage: 'TODO',
      examples: [ '{c}', 'TODO' ],
      triggers: [ 'device', 'devices' ]
    });
  }

  async execute (link, msg, args) {
    const { devices } = await spotifyOAuth.getDevices(link);
    if (!devices[0]) {
      return 'I was unable to find any devices that are running Spotify on this account.';
    }

    return {
      title: `${devices.length} devices found`,
      fields: devices.map(device => ({
        name: device.name,
        value: `Playing: ${device.is_active ? '☑' : '❌'}\nType: ${device.type}\nVolume: \`${device.volume_percent}%\``
      }))
    };
  }
};
