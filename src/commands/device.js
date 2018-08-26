const { LinkedCommand } = require('@sc/models');
const { spotifyOAuth } = require('@sc/rest');

module.exports = class DevicesCommand extends LinkedCommand {
  constructor (main) {
    super(main, {
      description: '__WORK IN PROGRESS__ Lists all of your devices running Spotify.',
      examples: [ '{c}', 'TODO' ],
      triggers: [ 'devices', 'device' ],
      order: 12
    });
  }

  async execute (link) {
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
